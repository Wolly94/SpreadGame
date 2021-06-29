import { Move } from "../messages/replay/replay";
import { SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
export interface Ai {
    playerId: number;
    getMove: (state: SpreadGameImplementation) => Move | null;
}
export declare const availableAttackers: (cell: Cell) => number;
export declare const estimatedDefenders: (defender: Cell, durationInMs: number | null | undefined) => number;
