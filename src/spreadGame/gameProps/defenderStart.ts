import { MapCell } from "../map/map";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface DefenderStartProps {
  additionalUnits: number;
}

export interface DefenderStartTrigger {}

export interface DefenderStartEffect
  extends Effect<DefenderStartProps, DefenderStartTrigger> {
  type: "DefenderStartEffect";
  getValue: (
    level: number, // level of perk
    trigger: DefenderStartTrigger,
    spreadGame: SpreadGameImplementation
  ) => DefenderStartProps;
}

export const defenderStartUtils: PropUtils<
  DefenderStartProps,
  DefenderStartTrigger
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
            (p): p is DefenderStartEffect => p.type === "DefenderStartEffect"
          )
          .map(
            (getProps): DefenderStartProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(defenderStartUtils.combine, defenderStartUtils.default);
    return combined;
  },
};
