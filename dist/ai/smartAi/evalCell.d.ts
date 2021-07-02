import { SpreadGameImplementation } from "../../spreadGame";
import { ReachableMap } from "../reachableMap";
import { FutureCell } from "./futureCells";
interface SenderInfo {
    cellId: number;
    units: number;
    durationInMs: number;
}
export interface CellAccessibility {
    receiverId: number;
    receivable: SenderInfo[];
}
export declare const evalAccessibility: (senderInfos: SenderInfo[], receiver: FutureCell) => void;
export declare const getAccessibility: (game: SpreadGameImplementation, receiverId: number, reachable: ReachableMap) => {
    receiverId: number;
    senderInfos: SenderInfo[];
} | null;
export {};
