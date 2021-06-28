import { GameSettings } from "../messages/inGame/gameServerMessages";
import { SkilledPerk } from "../skilltree/skilltree";
import { SpreadMap } from "../spreadGame/map/map";
export declare type ReachType = {
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
export declare const reachByUnit: (map: SpreadMap, settings: GameSettings, skills: SkilledPerk[], senderId: number, receiverId: number, unitsToSend: number) => {
    duration: number | "Infinity";
    receivedUnits: number;
};
export declare const reach: (map: SpreadMap, settings: GameSettings, skills: SkilledPerk[], senderId: number, receiverId: number) => ReachType;
