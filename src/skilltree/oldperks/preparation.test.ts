import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { Preparation } from "./preparation";

test("test preparation", () => {
  const rep = Preparation.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, 5000);
  var clientState = game.toClientGameState();
  const cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
});

test("test preparation cap", () => {
  const maxLength = 2000000;
  const rep: SpreadReplay = { ...Preparation.replay, lengthInMs: maxLength };
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, maxLength / 2);
  var clientState = game.toClientGameState();
  var cell2 = clientState.cells.find((c) => c.id === 1);
  const oldValue = cell2 === undefined ? 0 : cell2?.defenderCombatAbilities;
  game.runReplay(rep, 5000);
  clientState = game.toClientGameState();
  cell2 = clientState.cells.find((c) => c.id === 1);
  expect(oldValue).toBe(cell2?.defenderCombatAbilities);
});
