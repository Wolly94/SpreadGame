import SpreadReplay from "../../messages/replay/replay";
import { PerkEffect } from "../../spreadGame/gameProps/definitions";

export interface Perk<TValue> {
    name: string;
    //trigger: SpreadGameEvent[]; // determines when sth in the game should be updated (e.g. for the rage skill)
    effects: PerkEffect[];
    values: TValue[];
    description: string;
    replay: SpreadReplay;
}

export const getValue = <T>(values: T[], level: number, defaultValue: T): T => {
    if (level <= 0) return defaultValue;
    else {
        const val = values[Math.min(level, values.length) - 1];
        return val;
    }
};

export type GeneralPerk = Perk<number | [number, number]>;
