import { BasePopulationPerk } from "../perks/basePopulation";
import { FertileGroundsPerk } from "../perks/fertileGrounds";
import { Skill } from "../skilltree";

export const Population: Skill = {
    name: "Population",
    perks: [
        BasePopulationPerk.createFromValues(),
        FertileGroundsPerk.createFromValues(),
        /*Reinforcements*/
    ],
};
