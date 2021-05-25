import Bubble from "../bubble";
import Cell from "../cell";
import { radiusToUnits, radiusToUnitsFixPoint } from "../common";
import { distance } from "../entites";
import { FightModifier } from "../spreadGame";
import basicMechanics from "./basicMechanics";
import {
  calculationAccuracy,
  fight,
  minOverlap,
  overlap,
  reinforceCell,
  SpreadGameMechanics,
  takeOverCell,
} from "./commonMechanics";

export const fightBubblePartial = (
  att: number,
  def: number,
  am: number,
  bm: number,
  dist: number
): [number | null, number | null] => {
  const maxUnits = radiusToUnits(dist);
  const upperBound = am * maxUnits;
  const lowerBound = bm * maxUnits;
  const unitDiff = att * am - def * bm;
  if (unitDiff >= upperBound) return [unitDiff / am, null];
  else if (unitDiff <= -lowerBound) return [null, -unitDiff / bm];
  else {
    const beta =
      (unitDiff + bm * maxUnits) / ((2 * dist * bm) / radiusToUnitsFixPoint);
    const deltaMod = am - bm;
    if (deltaMod === 0) {
      const ra = beta;
      return [radiusToUnits(ra), radiusToUnits(dist - ra)];
    } else {
      const alpha = deltaMod / (2 * dist * bm);
      const ra =
        -1 / (2 * alpha) + Math.sqrt(beta / alpha + 1 / (4 * alpha ** 2));
      return [radiusToUnits(ra), radiusToUnits(dist - ra)];
    }
  }
};

export const cellFighters = (bubbleUnits: number, bubbleSpace: number) => {
  const fighters = bubbleUnits - radiusToUnits(bubbleSpace);
  return fighters;
};

const scrapeOffMechanics: SpreadGameMechanics = {
  collideBubble: (
    bubble1: Bubble,
    bubble2: Bubble,
    fightModifier: FightModifier
  ) => {
    if (overlap(bubble1, bubble2) < minOverlap + calculationAccuracy)
      return [bubble1, bubble2];
    if (bubble1.playerId === bubble2.playerId) return [bubble1, bubble2];
    const dist = distance(bubble1.position, bubble2.position);
    const [u1, u2] = fightBubblePartial(
      bubble1.units,
      bubble2.units,
      1.0,
      1.0,
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
  collideCell: (bubble: Bubble, cell: Cell, fightModifier: FightModifier) => {
    if (overlap(bubble, cell) < minOverlap + calculationAccuracy) return bubble;
    // if collides returns true, then dist <= bubble.radius
    const bubbleSpace = distance(bubble.position, cell.position) - cell.radius;
    if (bubbleSpace <= calculationAccuracy) {
      return basicMechanics.collideCell(bubble, cell, fightModifier);
    } else {
      const fighters = cellFighters(bubble.units, bubbleSpace);
      // fighters >= here
      if (bubble.playerId === cell.playerId) {
        reinforceCell(cell, fighters);
      } else {
        const result = fight(fighters, cell.units, fightModifier);
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
