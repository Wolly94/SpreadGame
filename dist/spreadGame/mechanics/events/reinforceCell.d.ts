import { ReinforcedCellEvent } from "../../../skilltree/events";
import { Effect } from "./definitions";
export interface ReinforceCellEffect extends Effect<ReinforcedCellEvent> {
    type: ReinforcedCellEvent["type"];
}
