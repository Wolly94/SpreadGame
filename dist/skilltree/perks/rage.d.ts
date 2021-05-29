import { HistoryEntry } from "../../messages/replay/replay";
import { SpreadGameEvent } from "../events";
import { Perk } from "./perk";
export declare const rageCondition: (lvl: number, eventHistory: HistoryEntry<SpreadGameEvent>[], timePassed: number, playerId: number) => boolean;
export declare const Rage: Perk<[number, number]>;
