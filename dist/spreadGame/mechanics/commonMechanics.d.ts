import Bubble from "../bubble";
import Cell from "../cell";
import { BubbleFightProps, CellFightProps } from "./events/fight";
import { GrowthProps } from "./events/growth";
import { MoveProps } from "./events/move";
import { SendUnitsProps } from "./events/sendUnits";
export declare const calculationAccuracy = 0.01;
export declare const minOverlap = 2;
export declare const fight: (att: number, def: number, am: BubbleFightProps, bm: BubbleFightProps | CellFightProps) => number;
export declare const fightBubblePartial: (att: number, def: number, am: number, bm: number, dist: number) => [number | null, number | null];
export declare const takeOverCell: (cell: Cell, newCellUnits: number, enemyPlayerId: number) => void;
export declare const reinforceCell: (cell: Cell, units: number) => void;
export declare const overlap: (b: Bubble, e: Bubble | Cell) => number;
export declare const centerOverlap: (b: Bubble, e: Bubble | Cell) => number;
export declare const entityDistance: (b: Bubble, e: Bubble | Cell) => number;
export declare const centerOverlapDistance: (b: Bubble, e: Bubble | Cell) => number;
export declare const isBubble: (val: any) => val is Bubble;
export declare const approaching: (b: Bubble, e: Bubble | Cell) => boolean;
export interface SpreadGameMechanics {
    collidesWithBubble: (bubble1: Bubble, bubble2: Bubble) => boolean;
    collidesWithCell: (bubble: Bubble, cell: Cell) => boolean;
    collideBubble: (bubble1: Bubble, bubble2: Bubble, f1: BubbleFightProps, f2: BubbleFightProps) => [Bubble | null, Bubble | null];
    collideCell: (bubble: Bubble, cell: Cell, f1: BubbleFightProps, f2: CellFightProps) => [Bubble | null, Cell];
    move: (bubble: Bubble, ms: number, moveProps: MoveProps) => Bubble;
    grow: (cell: Cell, ms: number, growthProps: GrowthProps) => Cell;
    sendBubble: (sender: Cell, target: Cell, timePassed: number, sendUnitsProps: SendUnitsProps) => [Cell, Bubble | null];
}
