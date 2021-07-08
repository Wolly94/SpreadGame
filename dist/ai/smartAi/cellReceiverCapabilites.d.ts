import { HistoryEntry } from "../../messages/replay/replay";
import { ReachableMap } from "../reachableMap";
import { CellSenderCapabilities } from "./cellSenderCapabilities";
import { PerPlayer } from "./perPlayer";
export interface UnitsReceived {
    earliestPossibleReceiverTimeInMs: number;
    latestPossibleReceiverTimeInMs: number;
    durationInMs: number;
    senderPlayerId: number;
    units: number;
}
export interface CellReceiveData {
    timeline: UnitsReceived[];
}
export declare const evalReceiverData: (recData: CellReceiveData) => HistoryEntry<PerPlayer<number>>[];
export interface CellReceiverCapabilities {
    get: (receiverId: number) => CellReceiveData | null;
    set: (receiverId: number, imp: CellReceiveData) => void;
}
export declare class CellReceiverCapabilityImplementation implements CellReceiverCapabilities {
    store: {
        receiverId: number;
        impact: CellReceiveData;
    }[];
    constructor(reachMap: ReachableMap, cellIds: number[], senderCaps: CellSenderCapabilities);
    get(receiverId: number): CellReceiveData | null;
    set(receiverId: number, imp: CellReceiveData): void;
}
