import { SpreadGameImplementation } from "..";
import { SkilledPerk } from "../../skilltree/skilltree";
import { AttackerConquerCellEffect } from "./attackerConquerCell";
import { AttackerFightEffect } from "./attackerFight";
import { DefenderGrowthEffect } from "./cellGrowth";
import { DefenderConquerCellEffect } from "./defenderConquerCell";
import { DefenderDefendCellEffect } from "./defenderDefendCell";
import { DefenderFightEffect } from "./defenderFight";
import { DefenderStartEffect } from "./defenderStart";

export type PropUtils<TProps, TTrigger> = {
  combine: (a: TProps, b: TProps) => TProps;
  default: TProps;
  collect: (
    perks: SkilledPerk[],
    trigger: TTrigger,
    spreadGame: SpreadGameImplementation
  ) => TProps;
};

export interface Effect<TProps, TTrigger> {
  getValue: (
    level: number, // level of perk
    trigger: TTrigger,
    spreadGame: SpreadGameImplementation
  ) => TProps;
}

export type PerkEffect =
  | AttackerFightEffect
  | DefenderFightEffect
  | AttackerConquerCellEffect
  | DefenderConquerCellEffect
  | DefenderDefendCellEffect
  | DefenderGrowthEffect
  | DefenderStartEffect;
