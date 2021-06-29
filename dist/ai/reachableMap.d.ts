import { GameSettings } from "../messages/inGame/gameServerMessages";
import { SkilledPerk } from "../skilltree/skilltree";
import { SpreadMap } from "../spreadGame/map/map";
import { ReachType } from "./reach";
export interface ReachableMap {
    get: (senderId: number, receiverId: number) => ReachType | null;
    set: (senderId: number, receiverId: number, reachType: ReachType) => void;
}
export declare class ReachableImplementation implements ReachableMap {
    store: {
        senderId: number;
        receiverId: number;
        reachType: ReachType;
    }[];
    constructor(settings: GameSettings, map: SpreadMap, skills: SkilledPerk[]);
    get(senderId: number, receiverId: number): {
        type: "basic";
        durationInMs: number;
        maxSendableUnits: number;
    } | {
        type: "scratch";
        durationInMs: number;
        maxReceivableUnits: number;
    } | {
        type: "bounce";
        durationInMs: number;
        absoluteUnitLoss: number;
    } | null;
    set(senderId: number, receiverId: number, reachType: ReachType): void;
}
