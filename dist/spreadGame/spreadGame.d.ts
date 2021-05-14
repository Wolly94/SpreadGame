import { ClientGameState } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import SpreadReplay, { HistoryEntry, Move } from "../messages/replay/replay";
import Bubble from "./bubble";
import Cell from "./cell";
import { SpreadMap } from "./map/map";
import { SpreadGameMechanics } from "./mechanics/commonMechanics";
import Player from "./player";
export interface SpreadGameState {
    cells: Cell[];
    bubbles: Bubble[];
    players: Player[];
}
export interface SpreadGameInteraction {
    sendUnits: (playerId: number, senderIds: number[], receiverId: number) => void;
}
export interface SpreadGameFunctions {
    step: (ms: number) => void;
    toClientGameState: () => ClientGameState;
    getReplay: () => SpreadReplay;
}
export interface FightModifier {
}
export declare type SpreadGame = SpreadGameState & SpreadGameFunctions & SpreadGameInteraction;
export declare class SpreadGameImplementation implements SpreadGame {
    map: SpreadMap;
    gameSettings: GameSettings;
    cells: Cell[];
    bubbles: Bubble[];
    players: Player[];
    pastMoves: HistoryEntry<Move>[];
    mechanics: SpreadGameMechanics;
    timePassed: number;
    constructor(map: SpreadMap, gameSettings: GameSettings);
    getReplay(): SpreadReplay;
    step(ms: number): void;
    collideBubblesWithBubbles(): void;
    collideBubblesWithCells(): void;
    sendUnits(playerId: number, senderIds: number[], receiverId: number): false | undefined;
    toClientGameState(): ClientGameState;
}
