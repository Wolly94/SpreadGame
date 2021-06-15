import { BasePopulation } from "../perks/basePopulation";
import { FertileGrounds } from "../perks/fertileGrounds";
import { Skill } from "../skilltree";

export const Population: Skill = {
  name: "Population",
  perks: [BasePopulation, FertileGrounds],
};
