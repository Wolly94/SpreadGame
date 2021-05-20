import { GameClientMessageData } from "../../messages/inGame/gameClientMessages";
import { GameServerMessage } from "../../messages/inGame/gameServerMessages";
import { ServerCommunication } from "../ServerCommunication";
import { PlayerData } from "./common";
import { InGame } from "./inGame";
import { Lobby } from "./lobby";
export declare class GameServerHandler {
    state: Lobby | InGame;
    serverCommunication: ServerCommunication<GameServerMessage, GameClientMessageData>;
    constructor();
    connectClient(token: string, playerData: PlayerData, sendToClient: (msg: GameServerMessage) => void): void;
    updateClients(): void;
    onMessageReceive(message: GameClientMessageData, token: string): void;
}
