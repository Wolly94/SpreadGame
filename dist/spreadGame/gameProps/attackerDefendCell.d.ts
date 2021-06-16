import { SpreadGameImplementation } from "..";
import { SkilledPerk } from "../../skilltree/skilltree";
import Cell from "../cell";
import { Effect } from "./definitions";
export declare type PropUtils<TProps, TEvent> = {
    combine: (a: TProps, b: TProps) => TProps;
    default: TProps;
    collect: (perks: SkilledPerk[], trigger: TEvent, spreadGame: SpreadGameImplementation) => TProps;
};
export interface AttackerDefendCellProps {
    blockGrowthInMs: number;
}
export interface AttackerDefendCellTrigger {
    attackerPlayerId: number;
    defender: Cell;
}
export interface AttackerDefendCellEffect extends Effect<AttackerDefendCellProps, AttackerDefendCellTrigger> {
    type: "AttackerDefendCellEffect";
    getValue: (level: number, // level of perk
    trigger: AttackerDefendCellTrigger, spreadGame: SpreadGameImplementation) => AttackerDefendCellProps;
}
export declare const attackerDefendCellUtils: PropUtils<AttackerDefendCellProps, AttackerDefendCellTrigger>;
