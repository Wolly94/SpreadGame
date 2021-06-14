import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { SpreadGameImplementation } from "../spreadGame";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import {
  AttackerFightProps,
  combineAttackerFightProps,
  combineAttackerConquerCellProps,
  combineDefendCellProps,
  combineDefenderFightProps,
  AttackerConquerCellProps,
  DefendCellProps,
  DefenderFightProps,
  DefenderConquerCellProps,
  combineDefenderConquerCellProps,
  PropUtils,
} from "../spreadGame/spreadGameProps";
import {
  GetAttackerFightProps,
  GetAttackerConquerCellProps,
  GetDefendCellProps,
  GetDefenderFightProps,
  GetDefenderConquerCellProps,
} from "./effects";
import { GeneralPerk } from "./perks/perk";
import { Attack } from "./skills/attack";
import { Defense } from "./skills/defense";
import { Spirit } from "./skills/spirit";

export interface SkilledPerk {
  perk: GeneralPerk;
  level: number;
}

export interface Skill {
  name: string;
  perks: GeneralPerk[];
}

export interface SkillTree {
  skills: Skill[];
}

export const validSkillTree = (
  skillTree: SkillTree,
  skilledPerks: SkilledPerk[]
) => {
  return true;
};

export const skillTreeMethods = {
  toData: (skillTree: SkillTree): SkillTreeData => {
    return {
      skills: skillTree.skills.map((sk) => {
        return {
          name: sk.name,
          perks: sk.perks.map((p) => {
            return { name: p.name };
          }),
        };
      }),
    };
  },
  fromData: (skillTreeData: SkillTreeData): SkillTree => {
    return {
      skills: skillTreeData.skills.map((skd) => {
        return {
          name: skd.name,
          perks: skd.perks
            .map((p) => getPerkByName(p.name))
            .filter((p): p is GeneralPerk => p !== null),
        };
      }),
    };
  },
  toSkilledPerks: (skilledPerkData: SkilledPerkData[]): SkilledPerk[] => {
    return skilledPerkData
      .map((spd) => {
        return { level: spd.level, perk: getPerkByName(spd.name) };
      })
      .filter((v): v is SkilledPerk => v.perk !== null);
  },
  toSkilledPerkData: (skilledPerks: SkilledPerk[]): SkilledPerkData[] => {
    return skilledPerks.map((sp) => {
      return { level: sp.level, name: sp.perk.name };
    });
  },
  getAttackerModifier: (
    skilledPerks: SkilledPerk[],
    attacker: Bubble,
    spreadGame: SpreadGameImplementation,
    defender: Cell | null
  ): AttackerFightProps => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is GetAttackerFightProps => p.type === "AttackerFightEffect"
          )
          .map(
            (getProps): AttackerFightProps =>
              getProps.getValue(
                skilledPerk.level,
                attacker,
                spreadGame,
                defender
              )
          );
      })
      .reduce(
        combineAttackerFightProps.combine,
        combineAttackerFightProps.default
      );
    return { combatAbilityModifier: 1 + combined.combatAbilityModifier / 100 };
  },
  getDefenderModifier: (
    skilledPerks: SkilledPerk[],
    defender: Cell,
    spreadGame: SpreadGameImplementation,
    attacker: Bubble | null
  ): DefenderFightProps => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is GetDefenderFightProps => p.type === "DefenderFightEffect"
          )
          .map(
            (getProps): DefenderFightProps =>
              getProps.getValue(
                skilledPerk.level,
                defender,
                spreadGame,
                attacker
              )
          );
      })
      .reduce(
        combineDefenderFightProps.combine,
        combineDefenderFightProps.default
      );
    return {
      ...combined,
      combatAbilityModifier: 1 + combined.combatAbilityModifier / 100,
    };
  },
  getAttackerConquerCellProps: (
    skilledPerks: SkilledPerk[]
  ): AttackerConquerCellProps => {
    return skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is GetAttackerConquerCellProps =>
              p.type === "AttackerConquerCellEffect"
          )
          .map((getProps) => getProps.getValue(skilledPerk.level));
      })
      .reduce(
        combineAttackerConquerCellProps.combine,
        combineAttackerConquerCellProps.default
      );
  },
  getDefenderConquerCellProps: (
    skilledPerks: SkilledPerk[]
  ): DefenderConquerCellProps => {
    return skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is GetDefenderConquerCellProps =>
              p.type === "DefenderConquerCellEffect"
          )
          .map((getProps) => getProps.getValue(skilledPerk.level));
      })
      .reduce(
        combineDefenderConquerCellProps.combine,
        combineDefenderConquerCellProps.default
      );
  },
  getDefendCellProps: (skilledPerks: SkilledPerk[]): DefendCellProps => {
    return skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter((p): p is GetDefendCellProps => p.type === "DefendCellEffect")
          .map(
            (getProps): DefendCellProps => getProps.getValue(skilledPerk.level)
          );
      })
      .reduce(combineDefendCellProps.combine, combineDefendCellProps.default);
  },
};

export const fullSkillTree: SkillTree = {
  skills: [Attack, Defense, Spirit],
};

export const defaultSkillTree: SkillTree = fullSkillTree;

export const allPerks: GeneralPerk[] = fullSkillTree.skills.flatMap(
  (sk) => sk.perks
);

export const getSkillByName = (name: string) => {
  const skill = fullSkillTree.skills.find((sk) => sk.name === name);
  if (skill === undefined) return null;
  else return skill;
};

export const getPerkByName = (name: string) => {
  const perk = allPerks.find((p) => p.name === name);
  if (perk === undefined) return null;
  else return perk;
};
