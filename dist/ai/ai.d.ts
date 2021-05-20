import { ClientGameState } from "../messages/inGame/clientGameState";
import { Move, SendUnitsMove } from "../messages/replay/replay";
export interface Ai {
    getMove: (state: ClientGameState, playerId: number) => Move | null;
}
export declare class GreedyAi implements Ai {
    getMove(state: ClientGameState, playerId: number): SendUnitsMove | null;
}
