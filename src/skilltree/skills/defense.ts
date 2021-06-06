import { BaseDefense } from "../perks/baseDefense";
import { LootsOfVictory } from "../perks/lootsOfVictory";
import { Membrane } from "../perks/membrane";
import { Preparation } from "../perks/preparation";
import { Skill } from "../skilltree";

export const Defense: Skill = {
  name: "Defense",
  perks: [BaseDefense, Preparation, LootsOfVictory, Membrane],
};
