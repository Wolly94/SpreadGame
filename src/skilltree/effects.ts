import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import { FightProps, SpreadGameImplementation } from "../spreadGame/spreadGame";
import { FightEvent, SpreadGameEvent } from "./events";

export interface GetFightProps {
  type: "FightEffect";
  getValue: (
    level: number, // level of perk
    attacker: Bubble,
    spreadGame: SpreadGameImplementation
  ) => FightProps;
}

export type PerkEffect = GetFightProps;
