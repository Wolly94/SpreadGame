import Bubble from "../bubble";
import Cell from "../cell";
import { AttackerFightProps } from "../gameProps/attackerFight";
import { DefenderGrowthProps } from "../gameProps/cellGrowth";
import { DefenderFightProps } from "../gameProps/defenderFight";
export declare const calculationAccuracy = 0.01;
export declare const minOverlap = 2;
export declare const fight: (att: number, def: number, am: AttackerFightProps, bm: AttackerFightProps | DefenderFightProps) => number;
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
    collideBubble: (bubble1: Bubble, bubble2: Bubble, f1: AttackerFightProps, f2: AttackerFightProps) => [Bubble | null, Bubble | null];
    collideCell: (bubble: Bubble, cell: Cell, f1: AttackerFightProps, f2: DefenderFightProps) => [Bubble | null, Cell];
    move: (bubble: Bubble, ms: number) => Bubble;
    grow: (cell: Cell, ms: number, growthProps: DefenderGrowthProps) => Cell;
    sendBubble: (sender: Cell, target: Cell, timePassed: number) => [Cell, Bubble | null];
}
