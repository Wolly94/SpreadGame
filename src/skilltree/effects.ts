import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import {
  ConquerCellProps,
  AttackerFightProps,
  SpreadGameImplementation,
} from "../spreadGame/spreadGame";
import { FightEvent, SpreadGameEvent } from "./events";

export interface GetAttackerFightProps {
  type: "FightEffect";
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

export interface GetConquerBubbleProps {
  type: "ConquerBubble";
  getValue: (
    level: number // level of perk
  ) => ConquerCellProps;
}

export type PerkEffect =
  | GetAttackerFightProps
  | GetDefenderFightProps
  | GetConquerBubbleProps;
