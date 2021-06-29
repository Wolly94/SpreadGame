import { GameSettings } from "../messages/inGame/gameServerMessages";
import { SendUnitsMove } from "../messages/replay/replay";
import { Player, SpreadGameImplementation } from "../spreadGame";
import { SpreadMap } from "../spreadGame/map/map";
import { Ai } from "./ai";
import { ReachableMap } from "./reachableMap";
export interface AttackerReducer {
    senderIds: number[];
    currentDefenders: number;
    totalAttackers: number;
}
export declare class GreedyAi implements Ai {
    playerId: number;
    reachable: ReachableMap;
    constructor(settings: GameSettings, map: SpreadMap, players: Player[], playerId: number);
    getMove(state: SpreadGameImplementation): SendUnitsMove | null;
}
