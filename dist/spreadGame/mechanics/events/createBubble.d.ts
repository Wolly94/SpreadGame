import Bubble from "../../bubble";
import Cell from "../../cell";
import { Effect } from "./definitions";
import { SendUnitsEvent } from "./sendUnits";
export interface CreateBubbleEvent {
    type: "CreateBubble";
    sendUnitsEvent: SendUnitsEvent;
    after: {
        sender: Cell;
        bubble: Bubble;
    };
}
export interface CreateBubbleEffect extends Effect<CreateBubbleEvent> {
    type: CreateBubbleEvent["type"];
}
