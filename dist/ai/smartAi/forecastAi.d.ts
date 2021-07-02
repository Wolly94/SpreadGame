import { GameSettings } from "../../messages/inGame/gameServerMessages";
import { Move } from "../../messages/replay/replay";
import { Player, SpreadGameImplementation } from "../../spreadGame";
import { SpreadMap } from "../../spreadGame/map/map";
import { Ai } from "../ai";
import { ReachableMap } from "../reachableMap";
export declare class ForecastAi implements Ai {
    playerId: number;
    reachable: ReachableMap;
    constructor(settings: GameSettings, map: SpreadMap, players: Player[], playerId: number);
    getMove(state: SpreadGameImplementation): Move | null;
}
