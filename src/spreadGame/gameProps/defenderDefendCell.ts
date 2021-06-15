import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface DefenderDefendCellProps {
  additionalUnits: number;
}

export interface DefenderDefendCellTrigger {}

export interface DefenderDefendCellEffect
  extends Effect<DefenderDefendCellProps, DefenderDefendCellTrigger> {
  type: "DefenderDefendCellEffect";
  getValue: (
    level: number, // level of perk
    trigger: DefenderDefendCellTrigger,
    spreadGame: SpreadGameImplementation
  ) => DefenderDefendCellProps;
}

export const defenderDefendCellUtils: PropUtils<
  DefenderDefendCellProps,
  DefenderDefendCellTrigger
> = {
  combine: (a, b) => {
    return {
      additionalUnits: a.additionalUnits + b.additionalUnits,
    };
  },
  default: { additionalUnits: 0 },
  collect: (skilledPerks, trigger, spreadGame) => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is DefenderDefendCellEffect =>
              p.type === "DefenderDefendCellEffect"
          )
          .map(
            (getProps): DefenderDefendCellProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(defenderDefendCellUtils.combine, defenderDefendCellUtils.default);
    return combined;
  },
};
