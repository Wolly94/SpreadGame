import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
export interface LostCellEvent {
    type: "LostCell";
    cellId: number;
    playerId: number | null;
    opponentPlayerId: number;
    opponentBubbleId: number;
}
export interface LostBubbleEvent {
    type: "LostBubble";
    playerId: number;
    opponentEntity: {
        type: "Bubble";
        bubble: Bubble;
    } | {
        type: "Cell";
        cell: Cell;
    };
}
export declare type FightResultEvent = LostCellEvent | LostBubbleEvent;
export declare type SpreadGameEvent = FightResultEvent;
