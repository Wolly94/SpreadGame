import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface DefenderFightProps {
  combatAbilityModifier: number;
  membraneAbsorption: number;
}

export interface DefenderFightTrigger {
  attacker: Bubble | null;
  defender: Cell;
}

export interface DefenderFightEffect
  extends Effect<DefenderFightProps, DefenderFightTrigger> {
  type: "DefenderFightEffect";
  getValue: (
    level: number, // level of perk
    trigger: DefenderFightTrigger,
    spreadGame: SpreadGameImplementation
  ) => DefenderFightProps;
}

export const defenderFightUtils: PropUtils<
  DefenderFightProps,
  DefenderFightTrigger
> = {
  combine: (a, b) => {
    return {
      combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
      membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
    };
  },
  default: { combatAbilityModifier: 0, membraneAbsorption: 0 },
  collect: (skilledPerks, trigger, spreadGame) => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is DefenderFightEffect => p.type === "DefenderFightEffect"
          )
          .map(
            (getProps): DefenderFightProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(defenderFightUtils.combine, defenderFightUtils.default);
    return {
      combatAbilityModifier: 1 + combined.combatAbilityModifier / 100,
      membraneAbsorption: combined.membraneAbsorption,
    };
  },
};
