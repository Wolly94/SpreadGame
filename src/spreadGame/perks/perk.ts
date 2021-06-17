import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameEffect } from "../mechanics/events/definitions";
import { SpreadGameImplementation } from "../spreadGame";
import { BaseAttackPerk } from "./baseAttack";
import { RagePerk } from "./rage";

export interface Perk<TValue> {
    displayName: string;
    name: string;
    triggers: SpreadGameEffect[];
    values: TValue[];
    defaultValue: TValue;
    description: (level: number) => string;
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

export const allPerks: GeneralPerk[] = [
    BaseAttackPerk.createFromValues(),
    RagePerk.createFromValues(),
];

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

export const numberPerkCreators = [BaseAttackPerk];
export const listPerkCreators = [RagePerk];

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
