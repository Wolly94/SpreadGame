export declare const distance: (pos1: [number, number], pos2: [number, number]) => number;
export declare const distanceToEntity: (entity: {
    position: [number, number];
    radius: number;
}, pos: [number, number]) => number;
export declare const entityContainsPoint: (entity: {
    position: [number, number];
    radius: number;
}, pos: [number, number]) => boolean;
