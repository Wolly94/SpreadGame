import { BaseAttack } from "../perks/baseAttack";
import { Berserk } from "../perks/berserk";
import { Rage } from "../perks/rage";
import { Skill } from "../skilltree";

export const Attack: Skill = {
  name: "Attack",
  perks: [BaseAttack, Rage, Berserk],
};
