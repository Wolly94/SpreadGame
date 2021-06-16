import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";
export interface SendUnitsEvent {
    type: "SendUnits";
    sender: Cell;
    target: Cell;
}
export interface SendUnitsProps {
    type: SendUnitsEvent["type"];
    additionalUnits: number;
}
export interface SendUnitsEffect extends Effect<SendUnitsEvent> {
    type: SendUnitsEvent["type"];
}
export declare const sendUnitsUtils: PropUtils<SendUnitsProps>;
