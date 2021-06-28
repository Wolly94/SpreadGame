import { SpreadGameImplementation } from "../spreadGame";
import { Ai } from "./ai";
declare class AiClient {
    ai: Ai;
    playerId: number;
    timeoutInterval: number;
    currentlyTimedOut: boolean;
    constructor(playerId: number, ai: Ai);
    getMove(gameState: SpreadGameImplementation): import("../messages/replay/replay").SendUnitsMove | null;
}
export default AiClient;
