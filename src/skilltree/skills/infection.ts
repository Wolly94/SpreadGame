import { BaseInfectionPerk } from "../perks/baseInfection";
import { DeadlyEnvironmentPerk } from "../perks/deadlyEnvironment";
import { Skill } from "../skilltree";

export const Infection: Skill = {
    name: "Infection",
    perks: [
        BaseInfectionPerk.createFromValues(),

        DeadlyEnvironmentPerk.createFromValues(),
    ],
};
