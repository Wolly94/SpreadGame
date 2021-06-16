import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";
export interface ConquerCellEvent {
    type: "ConquerCell";
    before: {
        cell: Cell;
    };
    after: {
        cell: Cell;
    };
}
export interface ConquerCellProps {
    type: ConquerCellEvent["type"];
    additionalUnits: number;
}
export interface ConquerCellEffect extends Effect<ConquerCellEvent> {
    type: ConquerCellEvent["type"];
}
export declare const conquerCellUtils: PropUtils<ConquerCellProps>;
