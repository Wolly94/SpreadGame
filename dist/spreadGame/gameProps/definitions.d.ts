import { SpreadGameImplementation } from "..";
import { SkilledPerk } from "../../skilltree/skilltree";
import { AttackerConquerCellEffect } from "./attackerConquerCell";
import { AttackerFightEffect } from "./attackerFight";
import { DefenderConquerCellEffect } from "./defenderConquerCell";
import { DefenderDefendCellEffect } from "./defenderDefendCell";
import { DefenderFightEffect } from "./defenderFight";
export declare type PropUtils<TProps, TTrigger> = {
    combine: (a: TProps, b: TProps) => TProps;
    default: TProps;
    collect: (perks: SkilledPerk[], trigger: TTrigger, spreadGame: SpreadGameImplementation) => TProps;
};
export interface Effect<TProps, TTrigger> {
    getValue: (level: number, // level of perk
    trigger: TTrigger, spreadGame: SpreadGameImplementation) => TProps;
}
export declare type PerkEffect = AttackerFightEffect | DefenderFightEffect | AttackerConquerCellEffect | DefenderConquerCellEffect | DefenderDefendCellEffect;
