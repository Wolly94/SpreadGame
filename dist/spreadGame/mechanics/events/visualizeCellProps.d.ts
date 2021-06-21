import { PropUtils } from "./definitions";
interface CellHideProps {
    showUnits: boolean;
}
export declare const cellHideUtils: {
    combine: (a: CellHideProps, b: CellHideProps) => CellHideProps;
    default: {
        showUnits: boolean;
    };
};
export declare type PlayerCellHideProps = Map<number, CellHideProps>;
export interface VisualizeCellProps {
    type: "VisualizeCellProps";
    hideProps: PlayerCellHideProps;
    combatAbilityModifier: number;
    membraneAbsorption: number;
    rageValue: number;
}
export declare const visualizeCellUtils: PropUtils<VisualizeCellProps>;
export {};
