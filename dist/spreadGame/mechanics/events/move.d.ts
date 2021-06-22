import Bubble from "../../bubble";
import { Effect, PropUtils } from "./definitions";
export interface MoveEvent {
    type: "Move";
    bubble: Bubble;
}
export interface MoveProps {
    type: MoveEvent["type"];
    additionalSpeedInPercent: number;
    unitLossPerSecond: number;
}
export interface MoveEffect extends Effect<MoveEvent> {
    type: MoveEvent["type"];
}
export declare const moveUtils: PropUtils<MoveProps>;
