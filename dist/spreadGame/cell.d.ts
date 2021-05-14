import Bubble from "./bubble";
declare class Cell {
    id: number;
    playerId: number | null;
    position: [number, number];
    radius: number;
    units: number;
    growthPerSecond: number;
    saturatedUnitCount: number;
    constructor(id: number, playerId: number | null, position: [number, number], units: number, radius: number);
    availableAttackers(): number;
    trySend(target: Cell): Bubble | null;
    grow(ms: number): void;
}
export default Cell;
