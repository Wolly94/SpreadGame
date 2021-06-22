import Bubble from "../../bubble"
import Cell from "../../cell"
import { Effect, PropUtils } from "./definitions"

const type = "ReinforceCell";

export interface ReinforceCellEvent {
    type: "ReinforceCell";
    before: { cell: Cell, bubble: Bubble };
    after: { cell: Cell, bubble: Bubble | null };
}

//export interface ReinforceCellProps {
//    type: ReinforceCellEvent["type"];
//    additionalUnits: number;
//    unitsInPercentToRemain: number;
//}

export interface ReinforceCellEffect extends Effect<ReinforceCellEvent> {
    type: ReinforceCellEvent["type"];
}

//export const reinforceCellUtils: PropUtils<ReinforceCellProps> = {
//    combine: (a, b) => {
//        return {
//            type: type,
//            additionalUnits: a.additionalUnits + b.additionalUnits,
//            unitsInPercentToRemain: a.unitsInPercentToRemain*b.unitsInPercentToRemain,
//        };
//    },
//    default: { type: type, additionalUnits: 0, unitsInPercentToRemain: 1 },
//    collect: (props) => {
//        return props
//            .filter((prop): prop is ReinforceCellProps => prop.type === type)
//            .reduce((prev, curr) => {
//                if (curr.type === type)
//                    return reinforceCellUtils.combine(prev, curr);
//                else return prev;
//            }, reinforceCellUtils.default);
//    },
//};
