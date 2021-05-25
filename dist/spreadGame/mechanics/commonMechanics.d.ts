import Bubble from "../bubble";
import Cell from "../cell";
import { FightModifier } from "../spreadGame";
export declare const calculationAccuracy = 0.01;
export declare const minOverlap = 2;
export declare const fight: (att: number, def: number, am: number, bm: number) => number;
export declare const fightBubblePartial: (att: number, def: number, am: number, bm: number, dist: number) => [number | null, number | null];
export declare const takeOverCell: (cell: Cell, newCellUnits: number, enemyPlayerId: number) => void;
export declare const reinforceCell: (cell: Cell, units: number) => void;
export declare const overlap: (b: Bubble, e: Bubble | Cell) => number;
export declare const centerOverlap: (b: Bubble, e: Bubble | Cell) => number;
export declare const entityDistance: (b: Bubble, e: Bubble | Cell) => number;
export declare const centerOverlapDistance: (b: Bubble, e: Bubble | Cell) => number;
export interface SpreadGameMechanics {
    collideBubble: (bubble1: Bubble, bubble2: Bubble, fightModifier: FightModifier) => [Bubble | null, Bubble | null];
    collideCell: (bubble: Bubble, cell: Cell, fightModifier: FightModifier) => Bubble | null;
    move: (bubble: Bubble, ms: number) => Bubble;
}
