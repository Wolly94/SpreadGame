import SpreadReplay from "../../messages/replay/replay";
import { PerkEffect } from "../effects";

export interface Perk<TValue> {
  name: string;
  //trigger: SpreadGameEvent[]; // determines when sth in the game should be updated (e.g. for the rage skill)
  effects: PerkEffect[];
  values: TValue[];
  description: string;
  replay: SpreadReplay;
}

export type GeneralPerk = Perk<number | [number, number]>;
