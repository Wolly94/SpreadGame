import { CapturedCellEvent } from "../../../skilltree/events";
import { Effect, PropUtils } from "./definitions";
export interface ConquerCellProps {
    type: CapturedCellEvent["type"];
    additionalUnits: number;
    unitsInPercentToRemain: number;
}
export interface ConquerCellEffect extends Effect<CapturedCellEvent> {
    type: CapturedCellEvent["type"];
}
export declare const conquerCellUtils: PropUtils<ConquerCellProps>;
