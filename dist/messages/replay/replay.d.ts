import { SpreadMap } from "../../spreadGame/map/map";
import Player from "../../spreadGame/player";
import { SendUnitsMessage } from "../inGame/clientInGameMessage";
import { GameSettings } from "../inGame/gameServerMessages";
export declare type Move = SendUnitsMessage;
export interface HistoryEntry<T> {
    timestamp: number;
    data: T;
}
interface SpreadReplay {
    map: SpreadMap;
    gameSettings: GameSettings;
    moveHistory: HistoryEntry<Move>[];
    players: Player[];
}
export default SpreadReplay;
