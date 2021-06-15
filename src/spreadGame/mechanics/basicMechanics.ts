import Bubble, { createBubble, getNewBubbleIndex, setUnits } from "../bubble";
import Cell from "../cell";
import { radiusToGrowth, radiusToUnits, unitsToRadius } from "../common";
import { AttackerFightProps } from "../gameProps/attackerFight";
import { GrowthProps } from "../gameProps/cellGrowth";
import { DefenderFightProps } from "../gameProps/defenderFight";
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
  collidesWithBubble: (bubble1: Bubble, bubble2: Bubble): boolean => {
    return !(centerOverlap(bubble1, bubble2) < calculationAccuracy);
  },
  collidesWithCell: (bubble: Bubble, cell: Cell): boolean => {
    return !(centerOverlap(bubble, cell) < calculationAccuracy);
  },
  collideBubble: (
    bubble1: Bubble,
    bubble2: Bubble,
    f1: AttackerFightProps,
    f2: AttackerFightProps
  ) => {
    if (!basicMechanics.collidesWithBubble(bubble1, bubble2)) {
      return [{ ...bubble1 }, { ...bubble2 }];
    }
    // TODO modify 'this' accordingly
    // return
    if (bubble1.playerId === bubble2.playerId)
      return [{ ...bubble1 }, { ...bubble2 }];
    const result = fight(bubble1.units, bubble2.units, f1, f2);
    if (Math.abs(result) < calculationAccuracy) {
      return [null, null];
    } else if (result > 0) {
      return [setUnits(bubble1, result), null];
    } else {
      return [null, setUnits(bubble2, -result)];
    }
  },
  collideCell: (
    bubble: Bubble,
    cell: Cell,
    f1: AttackerFightProps,
    f2: DefenderFightProps
  ) => {
    const resBubble = { ...bubble };
    const resCell = { ...cell };
    if (!basicMechanics.collidesWithCell(bubble, cell)) {
      [resBubble, resCell];
    }
    if (resBubble.playerId === resCell.playerId) {
      reinforceCell(resCell, resBubble.units);
    } else {
      const result = fight(resBubble.units, resCell.units, f1, f2);
      takeOverCell(resCell, result, resBubble.playerId);
    }
    return [null, resCell];
  },
  move: (bubble: Bubble, ms: number) => {
    const newPosition: [number, number] = [
      bubble.position[0] + (defaultSpeed * bubble.direction[0] * ms) / 1000.0,
      bubble.position[1] + (defaultSpeed * bubble.direction[1] * ms) / 1000.0,
    ];
    return { ...bubble, position: newPosition };
  },
  grow(cell: Cell, ms: number, growthProps: GrowthProps) {
    if (cell.playerId === null) return { ...cell };
    const saturatedUnitCount =
      radiusToUnits(cell.radius) + growthProps.additionalCapacity;
    const growthFactor = 1 + growthProps.additionalGrowthInPercent / 100;
    const posGrowthPerSecond = radiusToGrowth(cell.radius) * growthFactor;
    const negGrowthPerSecond = radiusToGrowth(cell.radius) / growthFactor;
    const toGrow = (posGrowthPerSecond * ms) / 1000;
    const toReduce = (negGrowthPerSecond * ms) / 1000;
    let nextUnits =
      cell.units < saturatedUnitCount
        ? Math.min(cell.units + toGrow, saturatedUnitCount)
        : Math.max(cell.units - toReduce, saturatedUnitCount);
    return { ...cell, units: nextUnits };
  },
  sendBubble(
    sender: Cell,
    target: Cell,
    timePassed: number
  ): [Cell, Bubble | null] {
    if (sender.playerId == null) return [{ ...sender }, null];
    var direction = [
      target.position[0] - sender.position[0],
      target.position[1] - sender.position[1],
    ];
    const dist = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
    if (dist === 0) return [{ ...sender }, null];
    const attacker = Math.floor(sender.units / 2);
    const resSender = { ...sender, units: sender.units - attacker };
    const lambda = sender.radius / dist;
    const normedDirection: [number, number] = [
      direction[0] / dist,
      direction[1] / dist,
    ];
    const position: [number, number] = [
      sender.position[0] + lambda * direction[0],
      sender.position[1] + lambda * direction[1],
    ];
    return [
      resSender,
      createBubble({
        id: getNewBubbleIndex(),
        direction: normedDirection,
        motherId: sender.id,
        playerId: sender.playerId,
        position: position,
        units: attacker,
        targetId: target.id,
        targetPos: target.position,
        creationTime: timePassed,
      }),
    ];
  },
};

export default basicMechanics;
