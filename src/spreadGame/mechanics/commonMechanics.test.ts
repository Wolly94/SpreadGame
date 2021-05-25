import Bubble from "../bubble";
import { centerOverlap, fight } from "./commonMechanics";

test("overlapCenter", () => {
  const pos1: [number, number] = [100, 100];
  const pos2: [number, number] = [110, 100];
  const b1 = new Bubble(0, pos1, [0, 0], 50, 0, 0, [1000, 1000]);
  const b2 = new Bubble(0, pos2, [0, 0], 50, 0, 0, [1000, 1000]);
  const overl = centerOverlap(b1, b2);
  expect(overl).toBe(40);
});

test("fight with modifiers", () => {
  const aUnits = [50, 50, 50];
  const dUnits = [40, 50, 60];
  const am = 11 / 10;
  const dm = 12 / 10;
  const rNeutral = [10, 0, -10];
  const rPlusAttack = [15 / am, 5 / am, -5];
  const rPlusDefense = [2, -10 / dm, -22 / dm];
  aUnits.forEach((att, index) => {
    const def = dUnits[index];
    const fneutral = fight(att, def, 1, 1);
    const fPlusAttack = fight(att, def, am, 1);
    const fPlusDefense = fight(att, def, 1, dm);
    expect(fneutral).toBeCloseTo(rNeutral[index]);
    expect(fPlusAttack).toBeCloseTo(rPlusAttack[index]);
    expect(fPlusDefense).toBeCloseTo(rPlusDefense[index]);
  });
});
