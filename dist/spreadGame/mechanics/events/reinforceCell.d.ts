import Bubble from "../../bubble";
import Cell from "../../cell";
import { Effect } from "./definitions";
export interface ReinforceCellEvent {
    type: "ReinforceCell";
    before: {
        cell: Cell;
        bubble: Bubble;
    };
    after: {
        cell: Cell;
        bubble: Bubble | null;
    };
}
export interface ReinforceCellEffect extends Effect<ReinforceCellEvent> {
    type: ReinforceCellEvent["type"];
}
