import { ClientGameState } from "../messages/inGame/clientGameState";
import { SendUnitsMessage } from "../messages/inGame/clientInGameMessage";
import { Move } from "../messages/replay/replay";
export interface Ai {
    getMove: (state: ClientGameState, playerId: number) => Move | null;
}
export declare class GreedyAi implements Ai {
    getMove(state: ClientGameState, playerId: number): SendUnitsMessage | null;
}
