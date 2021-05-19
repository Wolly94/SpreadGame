import { SpreadMap } from "../../spreadGame/map/map";
export interface PlayerData {
    name: string;
}
export interface RegisteredToken {
    playerData: PlayerData;
    token: string;
}
export interface AiPlayer {
    type: "ai";
    playerId: number;
}
export interface HumanPlayer {
    type: "human";
    token: string;
    playerId: number;
    playerData: PlayerData;
}
export declare type SeatedPlayer = AiPlayer | HumanPlayer;
export declare const occupiedSeats: (seatedPlayers: SeatedPlayer[]) => number[];
export declare const idFromToken: (token: string, seatedPlayers: SeatedPlayer[]) => number | null;
export declare const remainingSeats: (map: SpreadMap, seatedPlayers: SeatedPlayer[]) => number[];
