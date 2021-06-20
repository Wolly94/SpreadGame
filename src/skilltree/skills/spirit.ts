import { BaseSpiritPerk } from "../perks/baseSpirit";
import { Skill } from "../skilltree";

export const Spirit: Skill = {
    name: "Spirit",
    perks: [BaseSpiritPerk.createFromValues() /*, Kamikaze*/],
};
