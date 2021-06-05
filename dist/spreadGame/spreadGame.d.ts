import { ClientGameState } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import SpreadReplay, { HistoryEntry, Move } from "../messages/replay/replay";
import { SpreadGameEvent } from "../skilltree/events";
import Bubble from "./bubble";
import Cell from "./cell";
import { SpreadMap } from "./map/map";
import { SpreadGameMechanics } from "./mechanics/commonMechanics";
import Player from "./player";
export interface SpreadGameState {
    cells: Cell[];
    bubbles: Bubble[];
    players: Player[];
    timePassed: number;
}
export interface SpreadGameInteraction {
    applyMove: (move: Move) => void;
}
export interface SpreadGameFunctions {
    step: (ms: number) => void;
    toClientGameState: () => ClientGameState;
    getReplay: () => SpreadReplay;
}
export interface AttackerFightProps {
    combatAbilityModifier: number;
}
export interface DefenderFightProps {
    combatAbilityModifier: number;
}
export interface ConquerCellProps {
    additionalUnits: number;
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
    eventHistory: HistoryEntry<SpreadGameEvent>[];
    constructor(map: SpreadMap, gameSettings: GameSettings, players: Player[]);
    static fromReplay(replay: SpreadReplay): SpreadGameImplementation;
    runReplay(replay: SpreadReplay, ms: number): void;
    getReplay(): SpreadReplay;
    applyMove(move: Move): void;
    step(ms: number): void;
    collideBubblesWithBubbles(): void;
    collideBubblesWithCells(): void;
    sendUnits(playerId: number, senderIds: number[], receiverId: number): false | undefined;
    toClientGameState(): ClientGameState;
}
