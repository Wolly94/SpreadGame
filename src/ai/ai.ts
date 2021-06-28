import { ClientCell } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import { Move, SendUnitsMove } from "../messages/replay/replay";
import { GeneralPerk } from "../skilltree/perks/perk";
import { Player, SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { SpreadMap } from "../spreadGame/map/map";
import basicMechanics from "../spreadGame/mechanics/basicMechanics";
import { sendUnitsUtils } from "../spreadGame/mechanics/events/sendUnits";
import { reach, ReachType } from "./reach";

export interface Ai {
    getMove: (state: SpreadGameImplementation, playerId: number) => Move | null;
}

export const availableAttackers = (cell: Cell) => {
    const dummyCell: Cell = {
        id: -1,
        playerId: 0,
        position: [-100, -100],
        radius: 50,
        units: 50,
    };
    const [newCell, newBubble] = basicMechanics.sendBubble(
        cell,
        dummyCell,
        0,
        sendUnitsUtils.default
    );
    return newBubble === null ? 0 : newBubble.units;
};

const estimatedDefenders = (attacker: ClientCell, defender: ClientCell) => {
    return defender.data === null ? 25 : defender.data.units;
};

const getUnits = (cell: ClientCell) => {
    if (cell.data === null) return 100;
    else return cell.data.units;
};

export class GreedyAi implements Ai {
    reachable: Map<[number, number], ReachType>;
    constructor(
        settings: GameSettings,
        map: SpreadMap,
        players: Player[],
        perks: GeneralPerk[],
        playerId: number
    ) {
        this.reachable = new Map();

        const player = players.find((pl) => pl.id === playerId);
        const skills = player === undefined ? [] : player.skills;
        map.cells.forEach((senderCell) => {
            map.cells
                .filter((c) => c.id !== senderCell.id)
                .forEach((receiverCell) => {
                    const r = reach(
                        map,
                        settings,
                        skills,
                        senderCell.id,
                        receiverCell.id
                    );
                    this.reachable.set([senderCell.id, receiverCell.id], r);
                });
        });
    }
    getMove(state: SpreadGameImplementation, playerId: number) {
        const myCells = state.cells
            .filter((c) => c.playerId === playerId)
            // strongest cells first
            .sort((c1, c2) => c2.units - c1.units);
        const weakestUnownedCells = state.cells
            .filter((c) => c.playerId !== playerId)
            // weakest cells first
            .sort((c1, c2) => c1.units - c2.units);

        if (weakestUnownedCells.length === 0) return null;
        const weakestUnownedCell = weakestUnownedCells[0];
        let senderIds: number[] = [];
        const attackers = myCells.reduce((units, cell) => {
            if (units - 1 < weakestUnownedCell.units) {
                senderIds.push(cell.id);
                return units + availableAttackers(cell);
            } else {
                return units;
            }
        }, 0);
        if (attackers < weakestUnownedCell.units) return null;

        const result: SendUnitsMove = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCell.id,
                senderIds: senderIds,
                playerId: playerId,
            },
        };

        return result;
    }
}
