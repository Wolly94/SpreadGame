import { BaseDefense } from "../perks/baseDefense";
import { Preparation } from "../perks/preparation";
import { Skill } from "../skilltree";

export const Defense: Skill = {
  name: "Defense",
  perks: [BaseDefense, Preparation],
};
