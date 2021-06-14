import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { SpreadGameImplementation } from "../spreadGame";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { AttackerFightProps, ConquerCellProps, DefendCellProps, DefenderFightProps } from "../spreadGame/spreadGameProps";
import { GeneralPerk } from "./perks/perk";
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
export declare const validSkillTree: (skillTree: SkillTree, skilledPerks: SkilledPerk[]) => boolean;
export declare const skillTreeMethods: {
    toData: (skillTree: SkillTree) => SkillTreeData;
    fromData: (skillTreeData: SkillTreeData) => SkillTree;
    toSkilledPerks: (skilledPerkData: SkilledPerkData[]) => SkilledPerk[];
    toSkilledPerkData: (skilledPerks: SkilledPerk[]) => SkilledPerkData[];
    getAttackerModifier: (skilledPerks: SkilledPerk[], attacker: Bubble, spreadGame: SpreadGameImplementation, defender: Cell | null) => AttackerFightProps;
    getDefenderModifier: (skilledPerks: SkilledPerk[], defender: Cell, spreadGame: SpreadGameImplementation, attacker: Bubble | null) => DefenderFightProps;
    getConquerCellProps: (skilledPerks: SkilledPerk[]) => ConquerCellProps;
    getDefendCellProps: (skilledPerks: SkilledPerk[]) => DefendCellProps;
};
export declare const fullSkillTree: SkillTree;
export declare const defaultSkillTree: SkillTree;
export declare const allPerks: GeneralPerk[];
export declare const getSkillByName: (name: string) => Skill | null;
export declare const getPerkByName: (name: string) => GeneralPerk | null;
