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
    replay: SpreadReplay;
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

export type CreatePerk<TValue> = (values?: TValue[]) => Perk<TValue>;

export type GeneralPerk = Perk<number> | Perk<[number, number]>;

export const allPerks: GeneralPerk[] = [BaseAttackPerk(), RagePerk()];
