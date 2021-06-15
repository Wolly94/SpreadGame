import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface DefenderConquerCellProps {
  unitsInPercentToRemain: number;
}

export interface DefenderConquerCellTrigger {}

export interface DefenderConquerCellEffect
  extends Effect<DefenderConquerCellProps, DefenderConquerCellTrigger> {
  type: "DefenderConquerCellEffect";
  getValue: (
    level: number, // level of perk
    trigger: DefenderConquerCellTrigger,
    spreadGame: SpreadGameImplementation
  ) => DefenderConquerCellProps;
}

export const defenderConquerCellFightUtils: PropUtils<
  DefenderConquerCellProps,
  DefenderConquerCellTrigger
> = {
  combine: (a, b) => {
    return {
      unitsInPercentToRemain:
        a.unitsInPercentToRemain * b.unitsInPercentToRemain,
    };
  },
  default: { unitsInPercentToRemain: 0 },
  collect: (skilledPerks, trigger, spreadGame) => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is DefenderConquerCellEffect =>
              p.type === "DefenderConquerCellEffect"
          )
          .map(
            (getProps): DefenderConquerCellProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(
        defenderConquerCellFightUtils.combine,
        defenderConquerCellFightUtils.default
      );
    return combined;
  },
};
