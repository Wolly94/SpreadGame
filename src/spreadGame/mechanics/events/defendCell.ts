import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";

const type = "DefendCell";

export interface DefendCellEvent {
    type: "DefendCell";
    before: { cell: Cell };
    after: { cell: Cell };
}

export interface DefendCellProps {
    type: DefendCellEvent["type"];
    additionalUnits: number;
}

export interface DefendCellEffect extends Effect<DefendCellEvent> {
    type: DefendCellEvent["type"];
}

export const defendCellUtils: PropUtils<DefendCellProps> = {
    combine: (a, b) => {
        return {
            type: type,
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { type: type, additionalUnits: 0 },
    collect: (props) => {
        return props
            .filter((prop): prop is DefendCellProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return defendCellUtils.combine(prev, curr);
                else return prev;
            }, defendCellUtils.default);
    },
};
