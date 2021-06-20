import { PropUtils } from "./definitions";
export interface VisualizeCellProps {
    type: "VisualizeCellProps";
    combatAbilityModifier: number;
    membraneAbsorption: number;
    rageValue: number;
}
export declare const visualizeCellUtils: PropUtils<VisualizeCellProps>;
