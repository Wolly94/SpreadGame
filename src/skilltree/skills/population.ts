import { BasePopulationPerk } from "../perks/basePopulation"
import { Skill } from "../skilltree";

export const Population: Skill = {
    name: "Population",
    perks: [
        BasePopulationPerk.createFromValues(),
        /*FertileGrounds, Reinforcements*/
    ],
};
