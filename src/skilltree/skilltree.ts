import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { SpreadGameImplementation } from "../spreadGame";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import {
  AttackerFightProps,
  DefenderFightProps,
} from "../spreadGame/spreadGame";
import {
  GetAttackerFightProps,
  GetConquerBubbleProps,
  GetDefenderFightProps,
} from "./effects";
import { GeneralPerk } from "./perks/perk";
import { Attack } from "./skills/attack";
import { Defense } from "./skills/defense";

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
    spreadGame: SpreadGameImplementation
  ): AttackerFightProps => {
    var attackModifier = 0;
    skilledPerks.forEach((skilledPerk) => {
      skilledPerk.perk.effect
        .filter((p): p is GetAttackerFightProps => p.type === "FightEffect")
        .forEach((eff) => {
          attackModifier += eff.getValue(
            skilledPerk.level,
            attacker,
            spreadGame
          ).combatAbilityModifier;
        });
    });
    return { combatAbilityModifier: 1 + attackModifier / 100 };
  },
  getDefenderModifier: (
    skilledPerks: SkilledPerk[],
    defender: Cell,
    spreadGame: SpreadGameImplementation
  ): DefenderFightProps => {
    var attackModifier = 0;
    skilledPerks.forEach((skilledPerk) => {
      skilledPerk.perk.effect
        .filter(
          (p): p is GetDefenderFightProps => p.type === "DefenderFightEffect"
        )
        .forEach((eff) => {
          attackModifier += eff.getValue(
            skilledPerk.level,
            defender,
            spreadGame
          ).combatAbilityModifier;
        });
    });
    return { combatAbilityModifier: 1 + attackModifier / 100 };
  },
  getConquerProps: (skilledPerks: SkilledPerk[]) => {
    var additionalUnits = 0;
    skilledPerks.forEach((skilledPerk) => {
      skilledPerk.perk.effect
        .filter((p): p is GetConquerBubbleProps => p.type === "ConquerBubble")
        .forEach((eff) => {
          additionalUnits += eff.getValue(skilledPerk.level).additionalUnits;
        });
    });
    return { additionalUnits: additionalUnits };
  },
};

export const fullSkillTree: SkillTree = {
  skills: [Attack, Defense],
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
