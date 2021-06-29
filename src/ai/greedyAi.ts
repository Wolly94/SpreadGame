import { GameSettings } from "../messages/inGame/gameServerMessages";
import { SendUnitsMove } from "../messages/replay/replay";
import { Player, SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { distance } from "../spreadGame/entites";
import { SpreadMap } from "../spreadGame/map/map";
import { Ai, availableAttackers, estimatedDefenders } from "./ai";
import { ReachType } from "./reach";
import { ReachableImplementation, ReachableMap } from "./reachableMap";

const realAttackerCount = (
    attackers: number,
    reachType: ReachType | null
): number => {
    if (reachType?.type === "scratch") {
        return Math.max(attackers, reachType.maxReceivableUnits);
    } else if (reachType?.type === "basic") {
        if (attackers >= reachType.maxSendableUnits) return 0;
        else return attackers;
    } else if (reachType?.type === "bounce") {
        return Math.max(0, attackers - reachType.absoluteUnitLoss);
    } else return 0;
};

interface AttackerReducer {
    senderIds: number[];
    currentDefenders: number;
    totalAttackers: number;
}

const weightedDistance = (
    receiver: Cell,
    senders: Cell[],
    reachable: ReachableMap
) => {
    const result = senders.reduce((prev, curr) => {
        const dist = distance(curr.position, receiver.position);
        const r = reachable.get(curr.id, receiver.id);
        const realAttackers = realAttackerCount(availableAttackers(curr), r);
        return prev + realAttackers * dist;
    }, 0);
    return result;
};

export class GreedyAi implements Ai {
    playerId: number;
    reachable: ReachableMap;
    constructor(
        settings: GameSettings,
        map: SpreadMap,
        players: Player[],
        playerId: number
    ) {
        this.playerId = playerId;
        const player = players.find((pl) => pl.id === playerId);
        const skills = player === undefined ? [] : player.skills;
        this.reachable = new ReachableImplementation(settings, map, skills);
    }
    getMove(state: SpreadGameImplementation) {
        const myCells = state.cells.filter((c) => c.playerId === this.playerId);
        const weakestUnownedCells = state.cells
            .filter((c) => c.playerId !== this.playerId)
            // closer cells first
            // weakest cells first
            .sort((c1, c2) => {
                if (c1.units === c2.units) {
                    const w1 = weightedDistance(c1, myCells, this.reachable);
                    const w2 = weightedDistance(c2, myCells, this.reachable);
                    return w1 - w2;
                } else return c1.units - c2.units;
            });

        if (weakestUnownedCells.length === 0) return null;
        const weakestUnownedCell = weakestUnownedCells[0];

        const sortedAttackerCells = state.cells
            .filter((c) => c.playerId === this.playerId)
            .sort((c1, c2) => {
                const r1 = this.reachable.get(c1.id, weakestUnownedCell.id);
                const r2 = this.reachable.get(c2.id, weakestUnownedCell.id);
                const d1 = estimatedDefenders(
                    weakestUnownedCell,
                    r1?.durationInMs
                );
                const d2 = estimatedDefenders(
                    weakestUnownedCell,
                    r2?.durationInMs
                );
                const a1 =
                    realAttackerCount(availableAttackers(c1), r1) -
                    (d1 - weakestUnownedCell.units);
                const a2 =
                    realAttackerCount(availableAttackers(c2), r2) -
                    (d2 - weakestUnownedCell.units);
                return a2 - a1;
            });
        const atts: AttackerReducer = sortedAttackerCells.reduce(
            (prev: AttackerReducer, curr: Cell): AttackerReducer => {
                if (prev.totalAttackers > prev.currentDefenders) return prev;
                const r = this.reachable.get(curr.id, weakestUnownedCell.id);
                if (r === undefined || r === null) return prev;
                const newDefs = Math.max(
                    estimatedDefenders(weakestUnownedCell, r.durationInMs),
                    prev.currentDefenders
                );
                const realAttackers = realAttackerCount(
                    availableAttackers(curr),
                    r
                );
                return {
                    senderIds: [...prev.senderIds, curr.id],
                    currentDefenders: newDefs,
                    totalAttackers: prev.totalAttackers + realAttackers,
                };
            },
            {
                senderIds: [],
                currentDefenders: weakestUnownedCell.units,
                totalAttackers: 0,
            }
        );

        const result: SendUnitsMove = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCell.id,
                senderIds: atts.senderIds,
                playerId: this.playerId,
            },
        };

        return result;
    }
}
