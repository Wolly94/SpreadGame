import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { FightProps, SpreadGame } from "../spreadGame/spreadGame";

export interface FightEvent {
  type: "FightEvent";
  attackerId: number;
  defender: {
    type: "Bubble" | "Cell";
    id: number;
  };
}

export type SpreadGameEvent = FightEvent;

export interface GetFightProps {
  type: "FightEffect";
  getValue: (event: FightEvent, level: number) => number; //eventHistory: HistoryEntry<SpreadGameEvent>[]) => number;
}

export type PerkEffect = GetFightProps;

type GeneralPerk = Perk<number | string>;

export interface SkillTree {
  skilledPerks: [number, GeneralPerk][];
}

export interface Skill {
  perks: Perk<number | string>[];
}

export interface Perk<TValue> {
  name: string;
  //trigger: SpreadGameEvent[]; // determines when sth in the game should be updated (e.g. for the rage skill)
  effect: PerkEffect[];
  values: TValue[];
  description: string;
  skillable: (currentSkillTree: SkillTree) => boolean;
}

export interface SkillTreeFunctions {
  calculateAttackModifiers: (
    spreadGame: SpreadGame,
    entity: Bubble | Cell
  ) => FightProps;
}
