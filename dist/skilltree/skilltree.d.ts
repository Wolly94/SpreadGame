import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { GeneralPerk } from "../spreadGame/perks/perk";
import { OldGeneralPerk } from "./perks/perk";
export interface SkilledPerk {
    perk: GeneralPerk;
    level: number;
}
export interface Skill {
    name: string;
    perks: OldGeneralPerk[];
}
export interface SkillTree {
    skills: Skill[];
}
export declare const validSkillTree: (skillTree: SkillTree, skilledPerks: SkilledPerk[]) => boolean;
export declare const skillTreeMethods: {
    toData: (skillTree: SkillTree) => SkillTreeData;
    fromData: (skillTreeData: SkillTreeData) => SkillTree;
    toSkilledPerks: (skilledPerkData: SkilledPerkData[]) => SkilledPerk[];
    toSkilledPerkData: (skilledPerks: SkilledPerk[]) => SkilledPerkData[];
};
export declare const fullSkillTree: SkillTree;
export declare const defaultSkillTree: SkillTree;
export declare const allOldPerks: OldGeneralPerk[];
export declare const getSkillByName: (name: string) => Skill | null;
export declare const getOldPerkByName: (name: string) => OldGeneralPerk | null;
export declare const getPerkByName: (perkName: string) => GeneralPerk | null;
