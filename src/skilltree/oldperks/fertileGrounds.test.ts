import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { BasePopulation } from "./basePopulation";
import { FertileGrounds } from "./fertileGrounds";
import { playersWithoutSkills } from "./testHelper";

test("test fertile grounds", () => {
  const rep: SpreadReplay = FertileGrounds.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, rep.lengthInMs);
  const cstate = game.toClientGameState();
  const cell0 = cstate.cells.find((c) => c.id === 0);
  const cell1 = cstate.cells.find((c) => c.id === 1);
  if (cell1 === undefined) expect(true).toBe(false);
  else expect(cell0?.units).toBeGreaterThan(cell1.units);
});

test("test no fertile grounds", () => {
  const rep: SpreadReplay = {
    ...BasePopulation.replay,
    players: playersWithoutSkills(2),
  };
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, rep.lengthInMs);
  const cstate = game.toClientGameState();
  const cell0 = cstate.cells.find((c) => c.id === 0);
  const cell1 = cstate.cells.find((c) => c.id === 1);
  if (cell1 === undefined) expect(true).toBe(false);
  else expect(cell0?.units).toBe(cell1.units);
});
