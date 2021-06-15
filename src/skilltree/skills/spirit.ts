import { BaseSpirit } from "../perks/baseSpirit";
import { Kamikaze } from "../perks/kamikaze";
import { Skill } from "../skilltree";

export const Spirit: Skill = {
  name: "Spirit",
  perks: [BaseSpirit, Kamikaze],
};
