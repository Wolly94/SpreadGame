import { Perk, Skill } from "../skilltree";
import { formatDescription } from "../utils";

const values = [10, 20, 30];

export const BaseAttack: Perk<number> = {
  name: "Base",
  values: values,
  description:
    "Raises damage of your bubbles by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    ".",
  effect: [
    {
      type: "FightEffect",
      getValue: (lvl) => {
        if (lvl <= 0) return { attackModifier: 0 };
        else
          return { attackModifier: values[Math.min(lvl, values.length) - 1] };
      },
    },
  ],
  skillable: (skilltree, skilledPerks) => true,
};

export const Attack: Skill = {
  name: "Attack",
  perks: [BaseAttack],
};
