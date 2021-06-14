import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { SpreadGameImplementation } from "../spreadGame/spreadGame";
import {
  AttackerFightProps,
  AttackerConquerCellProps,
  DefendCellProps,
  DefenderFightProps,
  DefenderConquerCellProps,
} from "../spreadGame/spreadGameProps";

export interface GetAttackerFightProps {
  type: "AttackerFightEffect";
  getValue: (
    level: number, // level of perk
    attacker: Bubble,
    spreadGame: SpreadGameImplementation,
    defender: Cell | Bubble | null
  ) => AttackerFightProps;
}

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
  | GetAttackerFightProps
  | GetDefenderFightProps
  | GetAttackerConquerCellProps
  | GetDefenderConquerCellProps
  | GetDefendCellProps;
