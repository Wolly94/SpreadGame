import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";
export interface DefendCellEvent {
    type: "DefendCell";
    before: {
        cell: Cell;
    };
    after: {
        cell: Cell;
    };
}
export interface DefendCellProps {
    type: DefendCellEvent["type"];
    additionalUnits: number;
}
export interface DefendCellEffect extends Effect<DefendCellEvent> {
    type: DefendCellEvent["type"];
}
export declare const defendCellUtils: PropUtils<DefendCellProps>;
