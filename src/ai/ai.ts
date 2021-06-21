import {
    ClientCell,
    ClientGameState,
} from "../messages/inGame/clientGameState";
import { Move, SendUnitsMove } from "../messages/replay/replay";

export interface Ai {
    getMove: (state: ClientGameState, playerId: number) => Move | null;
}

const availableAttackers = (cell: ClientCell) => {
    return cell.data === null ? 0 : cell.data.units / 2;
};

const estimatedDefenders = (attacker: ClientCell, defender: ClientCell) => {
    return defender.data === null ? 25 : defender.data.units;
};

const getUnits = (cell: ClientCell) => {
    if (cell.data === null) return 100;
    else return cell.data.units;
};

export class GreedyAi implements Ai {
    getMove(state: ClientGameState, playerId: number) {
        const myCells = state.cells
            .filter((c) => c.playerId === playerId)
            .filter((c) => c.data === null || c.data.units >= 15)
            // strongest cells first
            .sort((c1, c2) => getUnits(c2) - getUnits(c1));
        const weakestUnownedCells = state.cells
            .filter((c) => c.playerId !== playerId)
            // weakest cells first
            .sort((c1, c2) => getUnits(c1) - getUnits(c2));

        if (weakestUnownedCells.length === 0) return null;
        const weakestUnownedCell = weakestUnownedCells[0];
        let senderIds: number[] = [];
        const attackers = myCells.reduce((units, cell) => {
            if (units - 1 < getUnits(weakestUnownedCell)) {
                senderIds.push(cell.id);
                return units + availableAttackers(cell);
            } else {
                return units;
            }
        }, 0);
        if (attackers < getUnits(weakestUnownedCell)) return null;

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
