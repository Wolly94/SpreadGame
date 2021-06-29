import { SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { AttackerData } from "./reach";
import { ReachableMap } from "./reachableMap";
export declare const isTarget: (game: SpreadGameImplementation, targetCellId: number, byPlayerId: number) => boolean;
export interface AttackerDataWithSenderId extends AttackerData {
    senderId: number;
}
export interface AnalyzeResult {
    maximalPossibleAttackers: number;
    senderIds: number[];
    currentAttackers: number;
    overshot: number;
    durationInMs: number;
}
export declare const analyzeCapturePlan: (cells: Cell[], targetCell: Cell, reachMap: ReachableMap) => AnalyzeResult;
