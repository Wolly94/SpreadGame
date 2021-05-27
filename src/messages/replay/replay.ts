import { SpreadMap } from "../../spreadGame/map/map";
import Player from "../../spreadGame/player";
import { SendUnitsMessage } from "../inGame/clientInGameMessage";
import { GameSettings } from "../inGame/gameServerMessages";

export interface SendUnitsMove {
  type: "sendunitsmove";
  data: {
    playerId: number;
    senderIds: number[];
    receiverId: number;
  };
}

export type Move = SendUnitsMove;

export interface HistoryEntry<T> {
  timestamp: number;
  data: T;
}

interface SpreadReplay {
  map: SpreadMap;
  gameSettings: GameSettings;
  moveHistory: HistoryEntry<Move>[];
  players: Player[];
  lengthInMs: number;
}

export default SpreadReplay;
