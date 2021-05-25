import Bubble from "../bubble";
import Cell from "../cell";
import { FightProps } from "../spreadGame";
import {
  calculationAccuracy,
  centerOverlap,
  fight,
  reinforceCell,
  SpreadGameMechanics,
  takeOverCell,
} from "./commonMechanics";

const basicMechanics: SpreadGameMechanics = {
  collideBubble: (
    bubble1: Bubble,
    bubble2: Bubble,
    f1: FightProps,
    f2: FightProps
  ) => {
    if (centerOverlap(bubble1, bubble2) < calculationAccuracy)
      return [bubble1, bubble2];
    // TODO modify 'this' accordingly
    // return
    if (bubble1.playerId === bubble2.playerId) return [bubble1, bubble2];
    const result = fight(
      bubble1.units,
      bubble2.units,
      f1.attackModifier,
      f2.attackModifier
    );
    if (Math.abs(result) < calculationAccuracy) {
      return [null, null];
    } else if (result > 0) {
      bubble1.units = result;
      bubble1.updateRadius();
      return [bubble1, null];
    } else {
      bubble2.units = -result;
      bubble2.updateRadius();
      return [null, bubble2];
    }
  },
  collideCell: (bubble: Bubble, cell: Cell, f1: FightProps, f2: FightProps) => {
    if (centerOverlap(bubble, cell) < calculationAccuracy) return bubble;
    if (bubble.playerId === cell.playerId) {
      reinforceCell(cell, bubble.units);
    } else {
      const result = fight(
        bubble.units,
        cell.units,
        f1.attackModifier,
        f2.attackModifier
      );
      takeOverCell(cell, result, bubble.playerId);
    }
    return null;
  },
  move: (bubble: Bubble, ms: number) => {
    bubble.position[0] += (bubble.speed * bubble.direction[0] * ms) / 1000.0;
    bubble.position[1] += (bubble.speed * bubble.direction[1] * ms) / 1000.0;
    return bubble;
  },
};

export default basicMechanics;
