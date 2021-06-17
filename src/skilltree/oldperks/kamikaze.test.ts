import { SpreadGameImplementation } from "../../spreadGame";
import { Kamikaze } from "./kamikaze";
import { playersWithoutSkills } from "./testHelper";

test("test kamikaze", () => {
  const rep = Kamikaze.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  var cstate = game.toClientGameState();
  var cell0 = cstate.cells.find((c) => c.id === 0);
  expect(cell0?.playerId).toBe(0);
  game.runReplay(rep, 3000);
  cstate = game.toClientGameState();
  cell0 = cstate.cells.find((c) => c.id === 0);
  expect(cell0?.playerId).toBe(1);
  expect(cell0?.units).toBeLessThan(30);
});

test("test no kamikaze", () => {
  const rep = {
    ...Kamikaze.replay,
    players: playersWithoutSkills(2),
  };
  const game = SpreadGameImplementation.fromReplay(rep);
  var cstate = game.toClientGameState();
  var cell0 = cstate.cells.find((c) => c.id === 0);
  expect(cell0?.playerId).toBe(0);
  game.runReplay(rep, 3000);
  cstate = game.toClientGameState();
  cell0 = cstate.cells.find((c) => c.id === 0);
  expect(cell0?.playerId).toBe(1);
  expect(cell0?.units).toBe(50);
});
