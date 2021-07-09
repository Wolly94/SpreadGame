import { SpreadGameImplementation } from "../../spreadGame";
import { FutureCells } from "./futureCells";
export interface UnitsSent {
    senderPlayerId: number;
    senderCellId: number;
    availableAttackers: number;
    earliestPossibleTimeInMs: number;
    latestPossibleTimeInMs: number | null;
}
export interface CellImpactData {
    timeline: UnitsSent[];
}
export interface CellSenderCapabilities {
    get: (senderId: number) => CellImpactData | null;
    set: (senderId: number, imp: CellImpactData) => void;
    getCellIds: () => number[];
}
export declare class CellSenderCapabilityImplementation implements CellSenderCapabilities {
    store: {
        senderId: number;
        impact: CellImpactData;
    }[];
    static fromGame(game: SpreadGameImplementation): CellSenderCapabilities;
    constructor(futCells: FutureCells);
    getCellIds(): number[];
    get(senderId: number): CellImpactData | null;
    set(senderId: number, imp: CellImpactData): void;
}
