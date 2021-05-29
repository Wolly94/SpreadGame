import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";

export interface LostCellEvent {
  type: "LostCell";
  cellId: number;
  playerId: number;
  opponentPlayerId: number;
  opponentBubbleId: number;
}

export interface LostBubbleEvent {
  type: "LostBubble";
  playerId: number;
  opponentPlayerId: number;
  opponentBubbleId: number;
}

export type FightResultEvent = LostCellEvent | LostBubbleEvent;

export type SpreadGameEvent = FightResultEvent;
