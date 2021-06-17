import { LootsOfVictory } from "../oldperks/lootsOfVictory";
import { Membrane } from "../oldperks/membrane";
import { Preparation } from "../oldperks/preparation";
import { BaseDefensePerk } from "../perks/baseDefense";
import { Skill } from "../skilltree";

export const Defense: Skill = {
    name: "Defense",
    perks: [
        BaseDefensePerk.createFromValues() /*, Preparation, LootsOfVictory, Membrane*/,
    ],
};
