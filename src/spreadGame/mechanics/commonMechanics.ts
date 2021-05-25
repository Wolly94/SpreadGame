import Bubble from "../bubble";
import Cell from "../cell";
import { radiusToUnits, radiusToUnitsFixPoint } from "../common";
import { distance } from "../entites";
import { FightProps } from "../spreadGame";

export const calculationAccuracy = 0.01;
export const minOverlap = 2;

// > 0 means attacker won, <= 0 means defender won
export const fight = (
  att: number,
  def: number,
  am: number,
  bm: number
): number => {
  const unitDiff = att * am - def * bm;
  if (unitDiff <= 0) return unitDiff / bm;
  else return unitDiff / am;
};

// returns remaining fighters from both entities
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

// newCellUnits is expected to be the result of 'fight' or 'fightCellPartial'
export const takeOverCell = (
  cell: Cell,
  newCellUnits: number,
  enemyPlayerId: number
) => {
  if (newCellUnits > calculationAccuracy) {
    cell.units = newCellUnits;
    cell.playerId = enemyPlayerId;
  } else {
    cell.units = -newCellUnits;
  }
};

export const reinforceCell = (cell: Cell, units: number) => {
  cell.units += units;
};

export const overlap = (b: Bubble, e: Bubble | Cell) => {
  return b.radius + e.radius - distance(b.position, e.position);
};

export const centerOverlap = (b: Bubble, e: Bubble | Cell) => {
  return Math.max(b.radius, e.radius) - distance(b.position, e.position);
};

// <= 0 if entities at least touch each other
export const entityDistance = (b: Bubble, e: Bubble | Cell) => {
  return Math.max(-overlap(b, e), 0);
};

// <= 0 if at least the center of one entity is contained in the other entity
export const centerOverlapDistance = (b: Bubble, e: Bubble | Cell) => {
  return Math.max(-centerOverlap(b, e), 0);
};

export interface SpreadGameMechanics {
  collideBubble: (
    bubble1: Bubble,
    bubble2: Bubble,
    f1: FightProps,
    f2: FightProps
  ) => [Bubble | null, Bubble | null];
  collideCell: (
    bubble: Bubble,
    cell: Cell,
    f1: FightProps,
    f2: FightProps
  ) => Bubble | null;
  move: (bubble: Bubble, ms: number) => Bubble;
}
