import { HistoryEntry } from "../../messages/replay/replay";
import { CollisionEvent } from "../../skilltree/events";
import { SpreadGameImplementation } from "../../spreadGame";
import Cell from "../../spreadGame/cell";
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
}
export declare class CellSenderCapabilityImplementation implements CellSenderCapabilities {
    store: {
        senderId: number;
        impact: CellImpactData;
    }[];
    static fromGame(game: SpreadGameImplementation): CellSenderCapabilities;
    constructor(collisionEvents: HistoryEntry<CollisionEvent>[], cells: Cell[], timePassedInMs: number);
    get(senderId: number): CellImpactData | null;
    set(senderId: number, imp: CellImpactData): void;
}
