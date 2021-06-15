import { SpreadGameImplementation } from "..";
import { Effect, PropUtils } from "./definitions";

export interface DefenderGrowthProps {
  additionalCapacity: number;
  additionalGrowthInPercent: number;
}

export interface DefenderGrowthTrigger {}

export interface DefenderGrowthEffect
  extends Effect<DefenderGrowthProps, DefenderGrowthTrigger> {
  type: "DefenderGrowthEffect";
  getValue: (
    level: number, // level of perk
    trigger: DefenderGrowthTrigger,
    spreadGame: SpreadGameImplementation
  ) => DefenderGrowthProps;
}

export const growthUtils: PropUtils<
  DefenderGrowthProps,
  DefenderGrowthTrigger
> = {
  combine: (a, b) => {
    return {
      additionalGrowthInPercent:
        a.additionalGrowthInPercent + b.additionalGrowthInPercent,
      additionalCapacity: a.additionalCapacity + b.additionalCapacity,
    };
  },
  default: { additionalGrowthInPercent: 0, additionalCapacity: 0 },
  collect: (skilledPerks, trigger, spreadGame) => {
    const combined = skilledPerks
      .flatMap((skilledPerk) => {
        return skilledPerk.perk.effects
          .filter(
            (p): p is DefenderGrowthEffect => p.type === "DefenderGrowthEffect"
          )
          .map(
            (getProps): DefenderGrowthProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(growthUtils.combine, growthUtils.default);
    return combined;
  },
};
