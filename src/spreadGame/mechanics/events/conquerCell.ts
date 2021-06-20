import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";

const type = "ConquerCell";

export interface ConquerCellEvent {
    type: "ConquerCell";
    before: { cell: Cell };
    after: { cell: Cell };
}

export interface ConquerCellProps {
    type: ConquerCellEvent["type"];
    additionalUnits: number;
    unitsInPercentToRemain: number;
}

export interface ConquerCellEffect extends Effect<ConquerCellEvent> {
    type: ConquerCellEvent["type"];
}

export const conquerCellUtils: PropUtils<ConquerCellProps> = {
    combine: (a, b) => {
        return {
            type: type,
            additionalUnits: a.additionalUnits + b.additionalUnits,
            unitsInPercentToRemain: a.unitsInPercentToRemain*b.unitsInPercentToRemain,
        };
    },
    default: { type: type, additionalUnits: 0, unitsInPercentToRemain: 1 },
    collect: (props) => {
        return props
            .filter((prop): prop is ConquerCellProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return conquerCellUtils.combine(prev, curr);
                else return prev;
            }, conquerCellUtils.default);
    },
};
