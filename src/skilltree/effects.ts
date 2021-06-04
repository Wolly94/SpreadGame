import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import {
  ConquerCellProps,
  FightProps,
  SpreadGameImplementation,
} from "../spreadGame/spreadGame";
import { FightEvent, SpreadGameEvent } from "./events";

export interface GetFightProps {
  type: "FightEffect";
  getValue: (
    level: number, // level of perk
    attacker: Bubble,
    spreadGame: SpreadGameImplementation
  ) => FightProps;
}

export interface GetConquerBubbleProps {
  type: "ConquerBubble";
  getValue: (
    level: number // level of perk
  ) => ConquerCellProps;
}

export type PerkEffect = GetFightProps | GetConquerBubbleProps;
