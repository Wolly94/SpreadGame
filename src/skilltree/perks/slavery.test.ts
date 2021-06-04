import { SpreadGameImplementation } from "../../spreadGame";
import { Slavery } from "./slavery";

test("test slavery", () => {
  const rep = Slavery.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, 2000);
  var clientState = game.toClientGameState();
  let cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
  game.runReplay(rep, 1000);
  var clientState = game.toClientGameState();
  cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(0);
  expect(cell2?.units).toBeGreaterThanOrEqual(20);
});
