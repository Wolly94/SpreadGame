import Bubble from "../bubble";
import Cell from "../cell";
import { radiusToUnits, radiusToUnitsFixPoint } from "../common";
import { distance } from "../entites";
import { FightProps } from "../spreadGame";
import basicMechanics from "./basicMechanics";
import {
  calculationAccuracy,
  fight,
  fightBubblePartial,
  minOverlap,
  overlap,
  reinforceCell,
  SpreadGameMechanics,
  takeOverCell,
} from "./commonMechanics";

export const cellFighters = (bubbleUnits: number, bubbleSpace: number) => {
  const fighters = bubbleUnits - radiusToUnits(bubbleSpace);
  return fighters;
};

const scrapeOffMechanics: SpreadGameMechanics = {
  collideBubble: (
    bubble1: Bubble,
    bubble2: Bubble,
    f1: FightProps,
    f2: FightProps
  ) => {
    if (overlap(bubble1, bubble2) < minOverlap + calculationAccuracy)
      return [bubble1, bubble2];
    if (bubble1.playerId === bubble2.playerId) return [bubble1, bubble2];
    const dist = distance(bubble1.position, bubble2.position);
    const [u1, u2] = fightBubblePartial(
      bubble1.units,
      bubble2.units,
      f1.attackModifier,
      f2.attackModifier,
      dist
    );
    if (u1 !== null) {
      bubble1.units = u1;
      bubble1.updateRadius();
    }
    if (u2 !== null) {
      bubble2.units = u2;
      bubble2.updateRadius();
    }
    return [u1 !== null ? bubble1 : null, u2 !== null ? bubble2 : null];
  },
  collideCell: (bubble: Bubble, cell: Cell, f1: FightProps, f2: FightProps) => {
    if (overlap(bubble, cell) < minOverlap + calculationAccuracy) return bubble;
    // if collides returns true, then dist <= bubble.radius
    const bubbleSpace = distance(bubble.position, cell.position) - cell.radius;
    if (bubbleSpace <= calculationAccuracy) {
      return basicMechanics.collideCell(bubble, cell, f1, f2);
    } else {
      const fighters = cellFighters(bubble.units, bubbleSpace);
      // fighters >= here
      if (bubble.playerId === cell.playerId) {
        reinforceCell(cell, fighters);
      } else {
        const result = fight(
          fighters,
          cell.units,
          f1.attackModifier,
          f2.attackModifier
        );
        takeOverCell(cell, result, bubble.playerId);
      }
      bubble.units -= fighters;
      bubble.updateRadius();
      return bubble;
    }
  },
  move: basicMechanics.move,
};

export default scrapeOffMechanics;
