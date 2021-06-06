import SpreadReplay from "../../messages/replay/replay";
import { PerkEffect } from "../effects";
export interface Perk<TValue> {
    name: string;
    effects: PerkEffect[];
    values: TValue[];
    description: string;
    replay: SpreadReplay;
}
export declare type GeneralPerk = Perk<number | [number, number]>;
