import { DefendedCellEvent } from "../../../skilltree/events";
import { Effect, PropUtils } from "./definitions";
export interface DefendCellProps {
    type: DefendedCellEvent["type"];
    additionalUnits: number;
}
export interface DefendCellEffect extends Effect<DefendedCellEvent> {
    type: DefendedCellEvent["type"];
}
export declare const defendCellUtils: PropUtils<DefendCellProps>;
