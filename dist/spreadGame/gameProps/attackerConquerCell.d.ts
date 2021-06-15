import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";
export interface AttackerConquerCellProps {
    additionalUnits: number;
}
export interface AttackerConquerCellTrigger {
}
export interface AttackerConquerCellEffect extends Effect<AttackerConquerCellProps, AttackerConquerCellTrigger> {
    type: "AttackerConquerCellEffect";
    getValue: (level: number, // level of perk
    trigger: AttackerConquerCellTrigger, spreadGame: SpreadGameImplementation) => AttackerConquerCellProps;
}
export declare const attackerConquerCellFightUtils: PropUtils<AttackerConquerCellProps, AttackerConquerCellTrigger>;
