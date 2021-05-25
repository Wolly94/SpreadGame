import { Perk, Skill } from "../skilltree";
import { formatDescription } from "../utils";

const values = [10, 20, 30];

const Base: Perk<number> = {
  name: "Base",
  values: values,
  description:
    "Raises damage of your cells by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    ".",
  effect: [
    {
      type: "FightEffect",
      getValue: (ev, lvl) => {
        return values[lvl];
      },
    },
  ],
  skillable: () => true,
};

const Attack: Skill = {
  perks: [Base],
};
