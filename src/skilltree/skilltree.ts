import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { FightProps } from "../spreadGame/spreadGame";
import { Attack } from "./attack/attack";

export interface FightEvent {
  type: "FightEvent";
  attacker: Bubble;
  opponent:
    | {
        type: "Bubble";
        val: Bubble;
      }
    | {
        type: "Cell";
        val: Cell;
      };
}

export type SpreadGameEvent = FightEvent;

export interface GetFightProps {
  type: "FightEffect";
  getValue: (level: number) => FightProps; //eventHistory: HistoryEntry<SpreadGameEvent>[]) => number;
}

export type PerkEffect = GetFightProps;

export type GeneralPerk = Perk<number | string>;

export interface SkilledPerks {
  perk: GeneralPerk;
  level: number;
}

export interface Skill {
  perks: GeneralPerk[];
}

export interface SkillTree {
  skills: Skill[];
}

export const validSkillTree = (
  skillTree: SkillTree,
  skilledPerks: SkilledPerks[]
) => {
  return true;
};

export interface Perk<TValue> {
  name: string;
  //trigger: SpreadGameEvent[]; // determines when sth in the game should be updated (e.g. for the rage skill)
  effect: PerkEffect[];
  values: TValue[];
  description: string;
  skillable: (skillTree: SkillTree, skilledPerks: SkilledPerks[]) => boolean;
}

export const skillTreeMethods = {
  getAttackerModifier: (skilledPerks: SkilledPerks[]) => {
    var attackModifier = 0;
    skilledPerks.forEach((skilledPerk) => {
      skilledPerk.perk.effect
        .filter((p): p is GetFightProps => p.type === "FightEffect")
        .forEach((eff) => {
          attackModifier += eff.getValue(skilledPerk.level).attackModifier;
        });
    });
    return { attackModifier: 1 + attackModifier / 100 };
  },
};

export const defaultSkillTree: SkillTree = {
  skills: [Attack],
};

export const fullSkillTree: SkillTree = {
  skills: [Attack],
};

export const allPerks: GeneralPerk[] = fullSkillTree.skills.flatMap(
  (sk) => sk.perks
);

export const getPerkByName = (name: string) => {
  const perk = allPerks.find((p) => p.name === name);
  if (perk === undefined) return null;
  else return perk;
};
