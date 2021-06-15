import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";
export interface DefenderConquerCellProps {
    unitsInPercentToRemain: number;
}
export interface DefenderConquerCellTrigger {
}
export interface DefenderConquerCellEffect extends Effect<DefenderConquerCellProps, DefenderConquerCellTrigger> {
    type: "DefenderConquerCellEffect";
    getValue: (level: number, // level of perk
    trigger: DefenderConquerCellTrigger, spreadGame: SpreadGameImplementation) => DefenderConquerCellProps;
}
export declare const defenderConquerCellUtils: PropUtils<DefenderConquerCellProps, DefenderConquerCellTrigger>;
