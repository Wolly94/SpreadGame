import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { FightProps } from "../spreadGame/spreadGame";
export interface FightEvent {
    type: "FightEvent";
    attacker: Bubble;
    opponent: {
        type: "Bubble";
        val: Bubble;
    } | {
        type: "Cell";
        val: Cell;
    };
}
export declare type SpreadGameEvent = FightEvent;
export interface GetFightProps {
    type: "FightEffect";
    getValue: (level: number) => FightProps;
}
export declare type PerkEffect = GetFightProps;
export declare type GeneralPerk = Perk<number | string>;
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
export interface Perk<TValue> {
    name: string;
    effect: PerkEffect[];
    values: TValue[];
    description: string;
    skillable: (skillTree: SkillTree, skilledPerks: SkilledPerk[]) => boolean;
}
export declare const skillTreeMethods: {
    getAttackerModifier: (skilledPerks: SkilledPerk[]) => {
        attackModifier: number;
    };
};
export declare const defaultSkillTree: SkillTree;
export declare const fullSkillTree: SkillTree;
export declare const allPerks: GeneralPerk[];
export declare const getPerkByName: (name: string) => GeneralPerk | null;
