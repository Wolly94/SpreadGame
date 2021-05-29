import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";

export interface LostCellEvent {
  type: "LostCell";
  cellId: number;
  oldPlayerId: number;
  newPlayerId: number;
}

export type SpreadGameEvent = LostCellEvent;
