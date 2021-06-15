import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";

export interface AttackerConquerCellProps {
  additionalUnits: number;
}

export interface AttackerConquerCellTrigger {}

export interface AttackerConquerCellEffect
  extends Effect<AttackerConquerCellProps, AttackerConquerCellTrigger> {
  type: "AttackerConquerCellEffect";
  getValue: (
    level: number, // level of perk
    trigger: AttackerConquerCellTrigger,
    spreadGame: SpreadGameImplementation
  ) => AttackerConquerCellProps;
}

export const attackerConquerCellFightUtils: PropUtils<
  AttackerConquerCellProps,
  AttackerConquerCellTrigger
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
            (p): p is AttackerConquerCellEffect =>
              p.type === "AttackerConquerCellEffect"
          )
          .map(
            (getProps): AttackerConquerCellProps =>
              getProps.getValue(skilledPerk.level, trigger, spreadGame)
          );
      })
      .reduce(
        attackerConquerCellFightUtils.combine,
        attackerConquerCellFightUtils.default
      );
    return combined;
  },
};
