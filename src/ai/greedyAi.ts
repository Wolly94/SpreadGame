import { gameClientMessages } from "../messages/inGame";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import { SendUnitsMove } from "../messages/replay/replay";
import { Player, SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { distance } from "../spreadGame/entites";
import { SpreadMap } from "../spreadGame/map/map";
import { Ai, availableAttackers, estimatedDefenders } from "./ai";
import { analyzeCapturePlan, isTarget } from "./aiHelper";
import { ReachType, getAttackerData } from "./reach";
import { ReachableImplementation, ReachableMap } from "./reachableMap";

export interface AttackerReducer {
    senderIds: number[];
    currentDefenders: number;
    totalAttackers: number;
}

export class GreedyAi implements Ai {
    playerId: number;
    reachable: ReachableMap;
    constructor(
        settings: GameSettings,
        map: SpreadMap,
        players: Player[],
        playerId: number
    ) {
        const player = players.find((pl) => pl.id === playerId);
        const skills = player === undefined ? [] : player.skills;
        this.reachable = new ReachableImplementation(settings, map, skills);
        this.playerId = playerId;
    }
    getMove(state: SpreadGameImplementation) {
        const myCells = state.cells.filter((c) => c.playerId === this.playerId);
        const cellsToTarget = state.cells.filter(
            (cell) =>
                cell.playerId !== this.playerId &&
                !isTarget(state, cell.id, this.playerId)
        );
        const weakestUnownedCells = cellsToTarget
            .map((c) => {
                const analyzed = analyzeCapturePlan(myCells, c, this.reachable);
                return { targetCell: c, analyze: analyzed };
            })
            .filter(data => {
                return data.analyze.senderIds.length !== 0
            })
            .sort((c1, c2) => {
                if (c1.analyze.durationInMs === c2.analyze.durationInMs) {
                    // cells surrounded by stronger cells first
                    return (
                        c2.analyze.maximalPossibleAttackers -
                        c1.analyze.maximalPossibleAttackers
                    );
                } else {
                    // closer cells first
                    return c1.analyze.durationInMs - c2.analyze.durationInMs;
                }
            });

        if (weakestUnownedCells.length === 0) return null;
        const weakestUnownedCellData = weakestUnownedCells[0];

        if (
            weakestUnownedCellData.analyze.overshot < 0 &&
            state.bubbles.filter((b) => b.playerId === this.playerId).length !==
                0
        )
            return null;

        const result: SendUnitsMove = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCellData.targetCell.id,
                senderIds: weakestUnownedCellData.analyze.senderIds,
                playerId: this.playerId,
            },
        };

        return result;
    }
}
