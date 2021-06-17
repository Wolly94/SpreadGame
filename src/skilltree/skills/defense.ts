import { BaseDefensePerk } from "../perks/baseDefense";
import { PreparationPerk } from "../perks/preparation";
import { Skill } from "../skilltree";

export const Defense: Skill = {
    name: "Defense",
    perks: [
        BaseDefensePerk.createFromValues(),
        PreparationPerk.createFromValues() /*, LootsOfVictory, Membrane*/,
    ],
};
