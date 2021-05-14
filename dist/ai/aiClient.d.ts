import { ClientGameState } from "../messages/inGame/clientGameState";
import { Ai } from "./ai";
declare class AiClient {
    ai: Ai;
    playerId: number;
    timeoutInterval: number;
    currentlyTimedOut: boolean;
    constructor(playerId: number, ai: Ai);
    getMove(gameState: ClientGameState): import("../messages/inGame/clientInGameMessage").SendUnitsMessage | null;
}
export default AiClient;
