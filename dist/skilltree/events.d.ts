import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
export interface FightEvent {
    type: "FightEvent";
    attacker: {
        before: Bubble;
        after: Bubble | null;
    };
    defender: {
        type: "Bubble";
        before: Bubble;
        after: Bubble | null;
    } | {
        type: "Cell";
        before: Cell;
        after: Cell;
    };
}
export interface SendBubbleEvent {
    type: "SendBubbleEvent";
    sender: Cell;
    receiver: Cell;
}
export declare type SpreadGameEvent = FightEvent | SendBubbleEvent;
