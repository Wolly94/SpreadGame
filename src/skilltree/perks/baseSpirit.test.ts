import { SpreadGameImplementation } from "../../spreadGame";
import { BaseSpirit } from "./baseSpirit";

test("test base spirit", () => {
  const rep = BaseSpirit.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, 1500);
  var clientState = game.toClientGameState();
  var cell0 = clientState.cells.find((c) => c.id === 0);
  var cell1 = clientState.cells.find((c) => c.id === 1);
  expect(cell0?.playerId).toBe(0);
  expect(cell1?.playerId).toBe(1);
  game.runReplay(rep, 3500);
  clientState = game.toClientGameState();
  cell0 = clientState.cells.find((c) => c.id === 0);
  cell1 = clientState.cells.find((c) => c.id === 1);
  expect(cell1?.playerId).toBe(0);
  expect(cell0?.playerId).toBe(0);
});
