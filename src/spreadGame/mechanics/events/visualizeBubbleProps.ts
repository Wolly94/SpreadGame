import { PropUtils } from "./definitions";

interface BubbleHideProps {
    invisible: boolean;
}

export const bubbleHideUtils = {
    combine: (a: BubbleHideProps, b: BubbleHideProps): BubbleHideProps => {
        return {
            invisible: a.invisible || b.invisible,
        };
    },
    default: { invisible: false },
};

export type PlayerBubbleHideProps = Map<number, BubbleHideProps>;

const combinePlayerBubbleHideProps = (
    a: PlayerBubbleHideProps,
    b: PlayerBubbleHideProps
): PlayerBubbleHideProps => {
    const res: PlayerBubbleHideProps = new Map();
    Array.from(a.entries()).forEach((entry) => {
        const [key, value] = entry;
        const exVal = res.get(key);
        res.set(
            key,
            bubbleHideUtils.combine(
                exVal === undefined ? bubbleHideUtils.default : exVal,
                value
            )
        );
    });
    Array.from(b.entries()).forEach((entry) => {
        const [key, value] = entry;
        const exVal = res.get(key);
        res.set(
            key,
            bubbleHideUtils.combine(
                exVal === undefined ? bubbleHideUtils.default : exVal,
                value
            )
        );
    });
    return res;
};

const type = "VisualizeBubbleProps";

export interface VisualizeBubbleProps {
    type: "VisualizeBubbleProps";
    combatAbilityModifier: number;
    hideProps: PlayerBubbleHideProps;
}

export const visualizeBubbleUtils: PropUtils<VisualizeBubbleProps> = {
    combine: (a, b) => {
        return {
            type: type,
            combatAbilityModifier:
                a.combatAbilityModifier + b.combatAbilityModifier,
            hideProps: combinePlayerBubbleHideProps(a.hideProps, b.hideProps),
        };
    },
    default: {
        type: type,
        combatAbilityModifier: 0,
        hideProps: new Map(),
    },
    collect: (props) => {
        return props
            .filter((prop): prop is VisualizeBubbleProps => prop.type === type)
            .reduce((prev, curr) => {
                if (curr.type === type)
                    return visualizeBubbleUtils.combine(prev, curr);
                else return prev;
            }, visualizeBubbleUtils.default);
    },
};
