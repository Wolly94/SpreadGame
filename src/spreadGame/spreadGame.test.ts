import { BaseAttack } from "../skilltree/perks/baseAttack";
import Bubble from "./bubble";
import Cell from "./cell";
import { SpreadMap } from "./map/map";
import { SpreadGameImplementation } from "./spreadGame";

const createMapHelper = (cells: Cell[]): SpreadMap => {
  return {
    height: 1000,
    width: 1000,
    players: 10,
    cells: cells,
  };
};

const calculatedCollisionTimeInMs = (b1: Bubble, b2: Bubble) => {
  const distance = Math.sqrt(
    (b1.position[0] - b2.position[0]) ** 2 +
      (b1.position[1] - b2.position[1]) ** 2
  );
  return (distance / 2 / b1.speed) * 1000;
};

test("bubble collision", () => {
  const cells = [
    new Cell(0, 0, [100, 100], 50, 50),
    new Cell(1, 1, [400, 500], 50, 50),
  ];
  const gameState = new SpreadGameImplementation(
    createMapHelper(cells),
    {
      mechanics: "basic",
      updateFrequencyInMs: 50,
    },
    [
      { id: 0, skills: [] },
      { id: 1, skills: [] },
    ]
  );
  gameState.sendUnits(0, [0], 1);
  gameState.sendUnits(1, [1], 0);
  expect(gameState.bubbles.length).toBe(2);
  const b1 = gameState.bubbles[0];
  const b2 = gameState.bubbles[1];
  const ms = calculatedCollisionTimeInMs(b1, b2);
  gameState.step(ms);
  expect(gameState.bubbles.length).toBe(0);
});

test("bubble collision with attack modifier", () => {
  const x = 10;
  const cells = [
    new Cell(0, 0, [100, 100], 50, 50),
    new Cell(1, 1, [400, 500], 50, 50),
  ];
  const gameState = new SpreadGameImplementation(
    createMapHelper(cells),
    {
      updateFrequencyInMs: 50,
      mechanics: "basic",
    },
    [
      {
        id: 0,
        skills: [{ level: 1, perk: BaseAttack }],
      },
      { id: 1, skills: [] },
    ]
  );
  gameState.sendUnits(0, [0], 1);
  gameState.sendUnits(1, [1], 0);
  expect(gameState.bubbles.length).toBe(2);
  const b1 = gameState.bubbles[0];
  const b2 = gameState.bubbles[1];
  const ms = calculatedCollisionTimeInMs(b1, b2);
  gameState.step(ms);
  expect(gameState.bubbles.length).toBe(1);
  const remBubble = gameState.bubbles[0];
  expect(remBubble.playerId).toBe(0);
});
