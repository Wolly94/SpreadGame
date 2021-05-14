import { GetReplayMessage } from "../replay/clientReplayMessages";
import { ClientInGameMessage } from "./clientInGameMessage";
import { ClientLobbyMessage } from "./clientLobbyMessage";
declare type GameClientMessageData = ClientLobbyMessage | ClientInGameMessage | GetReplayMessage;
export declare const isClientLobbyMessage: (msg: GameClientMessageData) => msg is ClientLobbyMessage;
export default GameClientMessageData;
