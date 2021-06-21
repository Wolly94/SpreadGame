import { SkilledPerk } from "../../../skilltree/skilltree";
import { PropUtils } from "./definitions";

const type = "StolenPerk";

export interface StolenPerksProps {
    type: "StolenPerk";
    skilledPerks: SkilledPerk[];
}

export const stolenPerksUtils: PropUtils<StolenPerksProps> = {
    combine: (a, b) => {
        return {
            type: type,
            skilledPerks: a.skilledPerks.concat(b.skilledPerks),
        };
    },
    default: { type: type, skilledPerks: [] },
    collect: (props) => {
        return props
            .filter((prop): prop is StolenPerksProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return stolenPerksUtils.combine(prev, curr);
                else return prev;
            }, stolenPerksUtils.default);
    },
};
