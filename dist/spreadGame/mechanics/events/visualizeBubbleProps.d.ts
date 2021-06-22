import { PropUtils } from "./definitions";
interface BubbleHideProps {
    invisible: boolean;
}
export declare const bubbleHideUtils: {
    combine: (a: BubbleHideProps, b: BubbleHideProps) => BubbleHideProps;
    default: {
        invisible: boolean;
    };
};
export declare type PlayerBubbleHideProps = Map<number, BubbleHideProps>;
export interface VisualizeBubbleProps {
    type: "VisualizeBubbleProps";
    hideProps: PlayerBubbleHideProps;
    combatAbilityModifier: number;
    infected: boolean;
}
export declare const visualizeBubbleUtils: PropUtils<VisualizeBubbleProps>;
export {};
