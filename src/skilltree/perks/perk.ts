import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { SpreadGameEffect } from "../../spreadGame/mechanics/events/definitions";
import { BaseAttackPerk } from "./baseAttack";
import { BaseDefensePerk } from "./baseDefense";
import { BerserkPerk } from "./berserk";
import { LootsOfVictoryPerk } from "./lootsOfVictory";
import { PreparationPerk } from "./preparation";
import { RagePerk } from "./rage";
import { SlaveryPerk } from "./slavery";

export interface Perk<TValue> {
    name: string;
    displayName: string;
    values: TValue[];
    defaultValue: TValue;
    description: (level: number) => string;
    triggers: SpreadGameEffect[];
}

export const getPerkLevel = (
    game: SpreadGameImplementation,
    perkName: string,
    playerId: number | null
): number => {
    const skPerk = game.getSkilledPerk(perkName, playerId);
    if (skPerk !== null) return skPerk.level;
    else return 0;
};

export const getPerkValueHelper = <TValue>(
    level: number,
    values: TValue[],
    defaultValue: TValue
) => {
    if (level <= 0) return defaultValue;
    else {
        const val = values[Math.min(level, values.length) - 1];
        return val;
    }
};

export const getPerkValue = <TValue>(
    game: SpreadGameImplementation,
    perkName: string,
    playerId: number | null,
    values: TValue[],
    defaultValue: TValue
) => {
    const lvl = getPerkLevel(game, perkName, playerId);
    const val = getPerkValueHelper(lvl, values, defaultValue);
    return val;
};

export interface CreatePerk<TValue> {
    createFromValues: (values?: TValue[]) => Perk<TValue>;
    name: string;
    replay: SpreadReplay;
}

export type PerkData = number | [number, number];

export type GeneralPerk = Perk<PerkData>;

export interface BackUpPerk {
    name: string;
    data:
        | { type: "number"; val: number[] }
        | { type: "number_number"; val: [number, number][] };
}

export const backupFromPerk = (perk: GeneralPerk): BackUpPerk => {
    const v1 = perk.values[0];
    const values: any = perk.values;
    return {
        name: perk.name,
        data:
            typeof v1 === "number"
                ? { type: "number", val: values }
                : { type: "number_number", val: values },
    };
};

export const allPerks: GeneralPerk[] = [
    BaseAttackPerk.createFromValues(),
    RagePerk.createFromValues(),
    BerserkPerk.createFromValues(),
    SlaveryPerk.createFromValues(),
    BaseDefensePerk.createFromValues(),
    PreparationPerk.createFromValues(),
    LootsOfVictoryPerk.createFromValues(),
];

export const numberPerkCreators = [
    BaseAttackPerk,
    SlaveryPerk,
    BaseDefensePerk,
    LootsOfVictoryPerk,
];
export const listPerkCreators = [RagePerk, BerserkPerk, PreparationPerk];

export const perkFromBackUp = (data: BackUpPerk): GeneralPerk | null => {
    const d = data.data;
    if (d.type === "number") {
        const perk = numberPerkCreators.find((p) => p.name === data.name);
        if (perk === undefined) return null;
        else return perk.createFromValues(d.val);
    } else {
        const perk = listPerkCreators.find((p) => p.name === data.name);
        if (perk === undefined) return null;
        else return perk.createFromValues(d.val);
    }
};
