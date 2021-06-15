import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { GeneralPerk } from "./perks/perk";
import { Attack } from "./skills/attack";
import { Defense } from "./skills/defense";
import { Population } from "./skills/population";
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
};

export const fullSkillTree: SkillTree = {
  skills: [Attack, Defense, Spirit, Population],
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
