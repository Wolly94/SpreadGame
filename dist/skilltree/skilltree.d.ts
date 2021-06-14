import { SkilledPerkData } from "../messages/inGame/clientLobbyMessage";
import { SkillTreeData } from "../messages/inGame/gameServerMessages";
import { SpreadGameImplementation } from "../spreadGame";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { AttackerConquerCellProps, DefendCellProps, DefenderFightProps, DefenderConquerCellProps } from "../spreadGame/spreadGameProps";
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
    getDefenderModifier: (skilledPerks: SkilledPerk[], defender: Cell, spreadGame: SpreadGameImplementation, attacker: Bubble | null) => DefenderFightProps;
    getAttackerConquerCellProps: (skilledPerks: SkilledPerk[]) => AttackerConquerCellProps;
    getDefenderConquerCellProps: (skilledPerks: SkilledPerk[]) => DefenderConquerCellProps;
    getDefendCellProps: (skilledPerks: SkilledPerk[]) => DefendCellProps;
};
export declare const fullSkillTree: SkillTree;
export declare const defaultSkillTree: SkillTree;
export declare const allPerks: GeneralPerk[];
export declare const getSkillByName: (name: string) => Skill | null;
export declare const getPerkByName: (name: string) => GeneralPerk | null;
