import SpreadReplay from "../../messages/replay/replay";
import { PerkEffect } from "../../spreadGame/gameProps/definitions";
export interface Perk<TValue> {
    name: string;
    effects: PerkEffect[];
    values: TValue[];
    description: string;
    replay: SpreadReplay;
}
export declare const getValue: <T>(values: T[], level: number, defaultValue: T) => T;
export declare type OldGeneralPerk = Perk<number | [number, number]>;
