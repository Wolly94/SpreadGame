import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkilledPerk } from "../skilltree/skilltree";
interface Player {
    id: number;
    skills: SkilledPerk[];
}
export interface PlayerData {
    id: number;
    skills: SkilledPerkData[];
}
export declare const playerFromData: (playerData: PlayerData) => Player;
export declare const dataFromPlayer: (player: Player) => PlayerData;
export default Player;
