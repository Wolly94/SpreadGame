import { SpreadGameImplementation } from "..";
import { SkilledPerk } from "../../skilltree/skilltree";

export type PropUtils<TProps, TTrigger> = {
  combine: (a: TProps, b: TProps) => TProps;
  default: TProps;
  collect: (
    perks: SkilledPerk[],
    trigger: TTrigger,
    spreadGame: SpreadGameImplementation
  ) => TProps;
};

export interface Effect<TProps, TTrigger> {
  getValue: (
    level: number, // level of perk
    trigger: TTrigger,
    spreadGame: SpreadGameImplementation
  ) => TProps;
}
