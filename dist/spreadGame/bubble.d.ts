export declare const getNewBubbleIndex: () => number;
export interface BubbleCreator {
    id: number;
    playerId: number;
    motherId: number;
    position: [number, number];
    direction: [number, number];
    units: number;
    targetId: number;
    targetPos: [number, number];
}
interface Bubble {
    id: number;
    playerId: number;
    motherId: number;
    position: [number, number];
    direction: [number, number];
    radius: number;
    units: number;
    targetId: number;
    targetPos: [number, number];
}
export declare const setUnits: (bubble: Bubble, units: number) => Bubble;
export declare const createBubble: (bc: BubbleCreator) => Bubble;
export default Bubble;
