import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameEffect } from "../mechanics/events/definitions";
import { SpreadGameImplementation } from "../spreadGame";
export interface Perk<TValue> {
    displayName: string;
    name: string;
    triggers: SpreadGameEffect[];
    values: TValue[];
    defaultValue: TValue;
    description: (level: number) => string;
    replay: SpreadReplay;
}
export declare const getPerkLevel: (game: SpreadGameImplementation, perkName: string, playerId: number | null) => number;
export declare const getPerkValueHelper: <TValue>(level: number, values: TValue[], defaultValue: TValue) => TValue;
export declare const getPerkValue: <TValue>(game: SpreadGameImplementation, perkName: string, playerId: number | null, values: TValue[], defaultValue: TValue) => TValue;
export declare type CreatePerk<TValue> = (values?: TValue[]) => Perk<TValue>;
export declare type GeneralPerk = Perk<number> | Perk<[number, number]>;
export declare const allPerks: GeneralPerk[];
