import { PropUtils } from "./definitions";
interface SinglePlayerInfectBubbleProps {
    infectionTimeLeftInMs: number;
}
export declare type PlayerInfectBubbleProps = Map<number, SinglePlayerInfectBubbleProps>;
export interface InfectBubbleProps {
    type: "InfectBubble";
    infectedBy: PlayerInfectBubbleProps;
}
export declare const infectBubbleUtils: PropUtils<InfectBubbleProps>;
export {};
