import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";

const type = "Growth";

export interface GrowthEvent {
    type: "Growth";
    cell: Cell;
}

export interface GrowthProps {
    type: GrowthEvent["type"];
    additionalCapacity: number;
    additionalGrowthInPercent: number;
}

export interface GrowthEffect extends Effect<GrowthEvent> {
    type: GrowthEvent["type"];
}

export const growthUtils: PropUtils<GrowthProps> = {
    combine: (a, b) => {
        return {
            type: type,
            additionalCapacity: a.additionalCapacity + b.additionalCapacity,
            additionalGrowthInPercent:
                a.additionalGrowthInPercent + b.additionalGrowthInPercent,
        };
    },
    default: {
        type: type,
        additionalCapacity: 0,
        additionalGrowthInPercent: 0,
    },
    collect: (props) => {
        return props
            .filter((prop): prop is GrowthProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return growthUtils.combine(prev, curr);
                else return prev;
            }, growthUtils.default);
    },
};
