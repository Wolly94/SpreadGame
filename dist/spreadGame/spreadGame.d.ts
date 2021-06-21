import { ClientGameState } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import SpreadReplay, { HistoryEntry, Move } from "../messages/replay/replay";
import { AfterFightState, BeforeFightState, SpreadGameEvent } from "../skilltree/events";
import { GeneralPerk } from "../skilltree/perks/perk";
import Bubble from "./bubble";
import Cell from "./cell";
import { SpreadMap } from "./map/map";
import { SpreadGameMechanics } from "./mechanics/commonMechanics";
import { AttachProps, Entity, NewSpreadGameEvent, SpreadGameProps, TimedProps } from "./mechanics/events/definitions";
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
    toClientGameState: (playerId: number | null) => ClientGameState;
    getReplay: () => SpreadReplay;
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
    perks: GeneralPerk[];
    attachedProps: AttachProps<TimedProps<SpreadGameProps>>[];
    constructor(map: SpreadMap, gameSettings: GameSettings, players: Player[], perks?: GeneralPerk[]);
    triggerStart(): void;
    static fromReplay(replay: SpreadReplay): SpreadGameImplementation;
    attachProps(props: AttachProps<TimedProps<SpreadGameProps>>[]): SpreadGameProps[];
    handleEvent(event: NewSpreadGameEvent): SpreadGameProps[];
    runReplay(replay: SpreadReplay, ms: number): void;
    getReplay(): SpreadReplay;
    applyMove(move: Move): void;
    run(ms: number, updateFrequencyInMs: number): void;
    step(ms: number): void;
    collideBubblesWithBubbles(): void;
    checkForFinishedFights(): void;
    processFight(before: BeforeFightState, after: AfterFightState): void;
    collideBubblesWithCells(): void;
    fromAttachedProps(entity: Entity): SpreadGameProps[];
    sendUnits(playerId: number, senderIds: number[], receiverId: number): false | undefined;
    getSkilledPerk(perkName: string, playerId: number | null): import("../skilltree/skilltree").SkilledPerk | null;
    toClientGameState(playerId?: number | null): ClientGameState;
    getSkilledPerks(playerId: number | null): import("../skilltree/skilltree").SkilledPerk[];
}
