import { BaseInfectionPerk } from "../perks/baseInfection";
import { Skill } from "../skilltree";

export const Infection: Skill = {
    name: "Infection",
    perks: [BaseInfectionPerk.createFromValues()],
};
