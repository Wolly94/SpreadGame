import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { SpreadGameEffect } from "../../spreadGame/mechanics/events/definitions";
export interface Perk<TValue> {
    displayName: string;
    name: string;
    triggers: SpreadGameEffect[];
    values: TValue[];
    defaultValue: TValue;
    description: (level: number) => string;
}
export declare const getPerkLevel: (game: SpreadGameImplementation, perkName: string, playerId: number | null) => number;
export declare const getPerkValueHelper: <TValue>(level: number, values: TValue[], defaultValue: TValue) => TValue;
export declare const getPerkValue: <TValue>(game: SpreadGameImplementation, perkName: string, playerId: number | null, values: TValue[], defaultValue: TValue) => TValue;
export interface CreatePerk<TValue> {
    createFromValues: (values?: TValue[]) => Perk<TValue>;
    name: string;
    replay: SpreadReplay;
}
export declare type PerkData = number | [number, number];
export declare type GeneralPerk = Perk<PerkData>;
export interface BackUpPerk {
    name: string;
    data: {
        type: "number";
        val: number[];
    } | {
        type: "number_number";
        val: [number, number][];
    };
}
export declare const backupFromPerk: (perk: GeneralPerk) => BackUpPerk;
export declare const allPerks: GeneralPerk[];
export declare const numberPerkCreators: CreatePerk<number>[];
export declare const listPerkCreators: CreatePerk<[number, number]>[];
export declare const perkFromBackUp: (data: BackUpPerk) => GeneralPerk | null;
