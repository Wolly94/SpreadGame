import { HistoryEntry } from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import Cell from "../../spreadGame/cell";
export declare type FutureCell = HistoryEntry<{
    cell: Cell;
    lastCapture: {
        cell: Cell;
        timePassedInMs: number;
    } | null;
}>;
export declare const prioritizeCells: (game: SpreadGameImplementation, playerId: number) => void;
export declare const forecastEnd: (cellChanges: HistoryEntry<Cell>[]) => FutureCell[];
export declare const getForecast: (game: SpreadGameImplementation) => HistoryEntry<Cell>[];
