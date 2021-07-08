import { HistoryEntry } from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
export interface CellHistoryData {
    playerId: number | null;
    immobilizedBeforeDurationInMs: number;
    units: number;
    sendableUnits: number;
}
export declare type CellHistory = HistoryEntry<CellHistoryData>[];
export declare type FutureCells = {
    cellId: number;
    history: CellHistory;
}[];
export declare const futureCellsFromGame: (game: SpreadGameImplementation) => FutureCells;
