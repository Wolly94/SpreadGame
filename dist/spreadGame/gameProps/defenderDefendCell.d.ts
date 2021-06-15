import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";
export interface DefenderDefendCellProps {
    additionalUnits: number;
}
export interface DefenderDefendCellTrigger {
}
export interface DefenderDefendCellEffect extends Effect<DefenderDefendCellProps, DefenderDefendCellTrigger> {
    type: "DefenderDefendCellEffect";
    getValue: (level: number, // level of perk
    trigger: DefenderDefendCellTrigger, spreadGame: SpreadGameImplementation) => DefenderDefendCellProps;
}
export declare const defenderDefendCellUtils: PropUtils<DefenderDefendCellProps, DefenderDefendCellTrigger>;
