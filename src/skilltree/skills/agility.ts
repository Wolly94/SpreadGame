import { BaseAgilityPerk } from "../perks/baseAgility";
import { Skill } from "../skilltree";

export const Agility: Skill = {
    name: "Agility",
    perks: [BaseAgilityPerk.createFromValues()],
};
