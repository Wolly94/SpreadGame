import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface AttackerFightProps {
  combatAbilityModifier: number;
}

export interface AttackerFightTrigger {
  attacker: Bubble;
  defender: Bubble | Cell | null;
}

export interface AttackerFightEffect
  extends Effect<AttackerFightProps, AttackerFightTrigger> {
  type: "AttackerFightEffect";
  getValue: (
    level: number, // level of perk
    trigger: AttackerFightTrigger,
    //attacker: Bubble,
    spreadGame: SpreadGameImplementation
    //defender: Cell | Bubble | null
  ) => AttackerFightProps;
}

export const attackerFightUtils: PropUtils<
  AttackerFightProps,
  AttackerFightTrigger
> = {
  combine: (a, b) => {
    return {
      combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
    };
  },
  default: { combatAbilityModifier: 0 },
  collect: (skilledPerks, trigger, spreadGame) => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is AttackerFightEffect => p.type === "AttackerFightEffect"
          )
          .map(
            (getProps): AttackerFightProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(attackerFightUtils.combine, attackerFightUtils.default);
    return { combatAbilityModifier: 1 + combined.combatAbilityModifier / 100 };
  },
};
