import { BasePopulation } from "../perks/basePopulation";
import { FertileGrounds } from "../perks/fertileGrounds";
import { Reinforcements } from "../perks/reinforcements";
import { Skill } from "../skilltree";

export const Population: Skill = {
  name: "Population",
  perks: [BasePopulation, FertileGrounds, Reinforcements],
};
