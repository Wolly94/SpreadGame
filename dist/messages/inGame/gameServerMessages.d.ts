import { SpreadMap } from "../../spreadGame/map/map";
import { SendReplayMessage } from "../replay/serverReplayMessages";
import { ClientGameState } from "./clientGameState";
import { SkilledPerkData } from "./clientLobbyMessage";
export declare type GameMechanics = "basic" | "scrapeoff" | "bounce";
export declare const gameMechs: GameMechanics[];
export declare const toGameMechanics: (s: string) => "bounce" | "basic" | "scrapeoff" | null;
export interface GameSettings {
    mechanics: GameMechanics;
}
export interface SetPlayerIdMessage {
    type: "playerid";
    data: {
        playerId: number | null;
    };
}
export interface ClientAiPlayer {
    type: "ai";
    playerId: number;
    skilledPerks: SkilledPerkData[];
}
export interface ClientHumanPlayer {
    type: "human";
    name: string;
    playerId: number;
    skilledPerks: SkilledPerkData[];
}
export interface ClientObserver {
    name: string;
}
export declare type ClientLobbyPlayer = ClientAiPlayer | ClientHumanPlayer;
export interface PerkData {
    name: string;
}
export interface SkillData {
    name: string;
    perks: PerkData[];
}
export interface SkillTreeData {
    skills: SkillData[];
}
export interface ClientLobbyState {
    players: ClientLobbyPlayer[];
    observers: ClientObserver[];
    map: SpreadMap | null;
    skillTree: SkillTreeData;
    gameSettings: GameSettings;
}
export interface LobbyStateMessage {
    type: "lobbystate";
    data: ClientLobbyState;
}
export interface GameStateMessage {
    type: "gamestate";
    data: ClientGameState;
}
export interface GameOverMessage {
    type: "gameover";
    data: null;
}
export declare type ServerLobbyMessage = SetPlayerIdMessage | LobbyStateMessage;
export declare type ServerInGameMessage = GameStateMessage | GameOverMessage;
export declare type GameServerMessage = ServerLobbyMessage | ServerInGameMessage | SendReplayMessage;
export declare const isServerLobbyMessage: (msg: GameServerMessage) => msg is ServerLobbyMessage;
