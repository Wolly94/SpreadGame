export default class Bubble {
    id: number;
    playerId: number;
    motherId: number;
    position: [number, number];
    direction: [number, number];
    speed: number;
    radius: number;
    units: number;
    targetId: number;
    targetPos: [number, number];
    constructor(playerId: number, position: [number, number], direction: [number, number], units: number, motherId: number, targetId: number, targetPos: [number, number]);
    updateRadius(): void;
}
