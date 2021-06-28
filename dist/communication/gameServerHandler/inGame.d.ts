/// <reference types="node" />
import AiClient from "../../ai/aiClient";
import { ClientInGameMessage } from "../../messages/inGame/clientInGameMessage";
import { GameSettings, GameStateMessage, GameServerMessage, LobbyStateMessage } from "../../messages/inGame/gameServerMessages";
import { GetReplayMessage } from "../../messages/replay/clientReplayMessages";
import { HistoryEntry, Move } from "../../messages/replay/replay";
import { SendReplayMessage } from "../../messages/replay/serverReplayMessages";
import { SkillTree } from "../../skilltree/skilltree";
import { SpreadGameImplementation } from "../../spreadGame";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGame } from "../../spreadGame/spreadGame";
import { SeatedPlayer, PlayerData } from "./common";
interface InGameState {
    type: "ingame";
    map: SpreadMap;
    gameSettings: GameSettings;
    seatedPlayers: SeatedPlayer[];
    aiClients: AiClient[];
    gameState: SpreadGame;
    intervalId: NodeJS.Timeout | null;
}
interface InGameFunctions {
    startGame: (updateCallback: (msg: GameStateMessage) => void) => void;
    stop: () => void;
    onReceiveMessage: (token: string, message: ClientInGameMessage | GetReplayMessage) => SendReplayMessage | null;
    onConnect: (token: string, playerData: PlayerData) => [boolean, GameServerMessage | null, LobbyStateMessage | null];
}
export declare type InGame = InGameState & InGameFunctions;
declare class InGameImplementation implements InGame {
    type: "ingame";
    map: SpreadMap;
    gameSettings: GameSettings;
    seatedPlayers: SeatedPlayer[];
    aiClients: AiClient[];
    gameState: SpreadGameImplementation;
    intervalId: NodeJS.Timeout | null;
    moveHistory: HistoryEntry<Move>[];
    skillTree: SkillTree;
    constructor(map: SpreadMap, settings: GameSettings, seatedPlayers: SeatedPlayer[], skillTree: SkillTree);
    isRunning(): boolean;
    stop(): void;
    onConnect(token: string, playerData: PlayerData): [boolean, GameServerMessage | null, LobbyStateMessage | null];
    onReceiveMessage(token: string, message: ClientInGameMessage | GetReplayMessage): SendReplayMessage | null;
    startGame(updateCallback: (msg: GameStateMessage, playerId: number | null) => void): void;
    applyAiMoves(): void;
    getGameStateMessage(playerId: number | null): GameStateMessage;
}
export default InGameImplementation;
