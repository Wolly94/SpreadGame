import { PropUtils } from "./definitions";

const type = "VisualizeCellProps";

export interface VisualizeCellProps {
    type: "VisualizeCellProps";
    combatAbilityModifier: number;
}

export const visualizeCellUtils: PropUtils<VisualizeCellProps> = {
    combine: (a, b) => {
        return {
            type: type,
            combatAbilityModifier:
                a.combatAbilityModifier + b.combatAbilityModifier,
        };
    },
    default: { type: type, combatAbilityModifier: 0 },
    collect: (props) => {
        return props
            .filter((prop): prop is VisualizeCellProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return visualizeCellUtils.combine(prev, curr);
                else return prev;
            }, visualizeCellUtils.default);
    },
};
