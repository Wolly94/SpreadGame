import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import {
  ConquerCellProps,
  AttackerFightProps,
  SpreadGameImplementation,
  DefendCellProps,
} from "../spreadGame/spreadGame";
import { FightEvent, SpreadGameEvent } from "./events";

export interface GetAttackerFightProps {
  type: "AttackerFightEffect";
  getValue: (
    level: number, // level of perk
    attacker: Bubble,
    spreadGame: SpreadGameImplementation
  ) => AttackerFightProps;
}

export interface GetDefenderFightProps {
  type: "DefenderFightEffect";
  getValue: (
    level: number, // level of perk
    defender: Cell,
    spreadGame: SpreadGameImplementation
  ) => AttackerFightProps;
}

export interface GetConquerCellProps {
  type: "ConquerCellEffect";
  getValue: (
    level: number // level of perk
  ) => ConquerCellProps;
}

export interface GetDefendCellProps {
  type: "DefendCellEffect";
  getValue: (level: number) => DefendCellProps;
}

// export interface GetLooseAttackProps

export type PerkEffect =
  | GetAttackerFightProps
  | GetDefenderFightProps
  | GetConquerCellProps
  | GetDefendCellProps;
