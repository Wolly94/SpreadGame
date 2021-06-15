import { SpreadGameImplementation } from "..";
import { Effect, PropUtils } from "./definitions";

export interface GrowthProps {
  additionalCapacity: number;
  additionalGrowthInPercent: number;
}

export interface GrowthTrigger {}

export interface GrowthEffect extends Effect<GrowthProps, GrowthTrigger> {
  type: "GrowthEffect";
  getValue: (
    level: number, // level of perk
    trigger: GrowthTrigger,
    spreadGame: SpreadGameImplementation
  ) => GrowthProps;
}

export const growthUtils: PropUtils<GrowthProps, GrowthTrigger> = {
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
          .filter((p): p is GrowthEffect => p.type === "GrowthEffect")
          .map(
            (getProps): GrowthProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(growthUtils.combine, growthUtils.default);
    return combined;
  },
};
