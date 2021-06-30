import { SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import basicMechanics from "../spreadGame/mechanics/basicMechanics";
import { sendUnitsUtils } from "../spreadGame/mechanics/events/sendUnits";

export interface CellExpectedFutureUnits {
    data: { timeStampInMs: number; attackers: number }[];
}

interface Support {
    type: "Support";
    units: number;
    durationInMs: number;
}

const getSupporters = (cell: Cell, targetCell: Cell): Support => {
    const [, bubble] = basicMechanics.sendBubble(
        cell,
        targetCell,
        0,
        sendUnitsUtils.default
    );
    return {
        type: "Support",
        units: bubble !== null ? bubble.units : 0,
        durationInMs: -1,
    };
};

export const evaluateCell = (
    game: SpreadGameImplementation,
    cell: Cell,
    playerId: number
) => {
    const copiedGame = game.copy();
    const ownCells = game.cells.filter((c) => c.playerId === playerId);
    const enemyCells = game.players
        .filter((pl) => pl.id !== playerId)
        .map((pl) => {
            return game.cells.filter((c) => c.playerId === pl.id);
        });
};
