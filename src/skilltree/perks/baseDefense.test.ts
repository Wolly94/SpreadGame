import { SpreadGameImplementation } from "../../spreadGame";
import { BaseDefense } from "./baseDefense";

test("test baseDefense", () => {
  const rep = BaseDefense.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  var clientState = game.toClientGameState();
  var cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
  game.runReplay(rep, 2000);
  clientState = game.toClientGameState();
  cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
  game.runReplay(rep, 1000);
  clientState = game.toClientGameState();
  cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
  expect(cell2?.defenderCombatAbilities).toBe(1.3);
});
