import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { AttackerFightEffect } from "../spreadGame/gameProps/attackerFight";
import { SpreadGameImplementation } from "../spreadGame/spreadGame";
import {
  AttackerConquerCellProps,
  DefendCellProps,
  DefenderFightProps,
  DefenderConquerCellProps,
} from "../spreadGame/spreadGameProps";

export interface GetDefenderFightProps {
  type: "DefenderFightEffect";
  getValue: (
    level: number, // level of perk
    defender: Cell,
    spreadGame: SpreadGameImplementation,
    attacker: Bubble | null
  ) => DefenderFightProps;
}

export interface GetAttackerConquerCellProps {
  type: "AttackerConquerCellEffect";
  getValue: (
    level: number // level of perk
  ) => AttackerConquerCellProps;
}

export interface GetDefenderConquerCellProps {
  type: "DefenderConquerCellEffect";
  getValue: (
    level: number // level of perk
  ) => DefenderConquerCellProps;
}

export interface GetDefendCellProps {
  type: "DefendCellEffect";
  getValue: (level: number) => DefendCellProps;
}

// export interface GetLooseAttackProps

export type PerkEffect =
  | AttackerFightEffect
  | GetDefenderFightProps
  | GetAttackerConquerCellProps
  | GetDefenderConquerCellProps
  | GetDefendCellProps;
