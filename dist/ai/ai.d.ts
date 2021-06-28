import { GameSettings } from "../messages/inGame/gameServerMessages";
import { Move, SendUnitsMove } from "../messages/replay/replay";
import { GeneralPerk } from "../skilltree/perks/perk";
import { Player, SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { SpreadMap } from "../spreadGame/map/map";
import { ReachType } from "./reach";
export interface Ai {
    getMove: (state: SpreadGameImplementation, playerId: number) => Move | null;
}
export declare const availableAttackers: (cell: Cell) => number;
export declare class GreedyAi implements Ai {
    reachable: Map<[number, number], ReachType>;
    constructor(settings: GameSettings, map: SpreadMap, players: Player[], perks: GeneralPerk[], playerId: number);
    getMove(state: SpreadGameImplementation, playerId: number): SendUnitsMove | null;
}
