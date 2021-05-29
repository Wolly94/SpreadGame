import Bubble, { createBubble, getNewBubbleIndex, setUnits } from "../bubble";
import Cell from "../cell";
import { radiusToGrowth, radiusToUnits, unitsToRadius } from "../common";
import { FightProps } from "../spreadGame";
import {
  calculationAccuracy,
  centerOverlap,
  fight,
  reinforceCell,
  SpreadGameMechanics,
  takeOverCell,
} from "./commonMechanics";

export const defaultSpeed = 90;

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
      return [setUnits(bubble1, result), null];
    } else {
      return [null, setUnits(bubble2, -result)];
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
    bubble.position[0] += (defaultSpeed * bubble.direction[0] * ms) / 1000.0;
    bubble.position[1] += (defaultSpeed * bubble.direction[1] * ms) / 1000.0;
    return bubble;
  },
  grow(cell: Cell, ms: number) {
    if (cell.playerId === null) return cell;
    const saturatedUnitCount = radiusToUnits(cell.radius);
    const sign = cell.units > saturatedUnitCount ? -1 : 1;
    const growthPerSecond = radiusToGrowth(cell.radius);
    let nextUnits = cell.units + (sign * (growthPerSecond * ms)) / 1000;
    let newUnits =
      (nextUnits > saturatedUnitCount && sign === 1) ||
      (nextUnits < saturatedUnitCount && sign === -1)
        ? saturatedUnitCount
        : nextUnits;
    return { ...cell, units: newUnits };
  },
  sendBubble(sender: Cell, target: Cell): Bubble | null {
    if (sender.playerId == null) return null;
    const attacker = Math.floor(sender.units / 2);
    sender.units -= attacker;
    var direction = [
      target.position[0] - sender.position[0],
      target.position[1] - sender.position[1],
    ];
    const dist = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
    if (dist === 0) return null;
    const lambda = sender.radius / dist;
    const normedDirection: [number, number] = [
      direction[0] / dist,
      direction[1] / dist,
    ];
    const position: [number, number] = [
      sender.position[0] + lambda * direction[0],
      sender.position[1] + lambda * direction[1],
    ];
    return createBubble({
      id: getNewBubbleIndex(),
      direction: normedDirection,
      motherId: sender.id,
      playerId: sender.playerId,
      position: position,
      units: attacker,
      targetId: target.id,
      targetPos: target.position,
    });
  },
};

export default basicMechanics;
