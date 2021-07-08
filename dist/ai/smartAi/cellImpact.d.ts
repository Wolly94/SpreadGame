import { CellImpactData } from "./cellSenderCapabilities";
interface CellImpactCollector {
    get: (senderId: number, receiverId: number) => CellImpactData | null;
    set: (senderId: number, receiverId: number, imp: CellImpactData) => void;
}
export declare class CellImpactCollectorImplementation implements CellImpactCollector {
    store: {
        senderId: number;
        receiverId: number;
        impact: CellImpactData;
    }[];
    constructor();
    get(senderId: number, receiverId: number): CellImpactData | null;
    set(senderId: number, receiverId: number, imp: CellImpactData): void;
}
export {};
