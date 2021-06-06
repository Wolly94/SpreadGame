import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { Membrane } from "./membrane";

test("test membrane", () => {
  const rep: SpreadReplay = {
    ...Membrane.replay,
    gameSettings: { mechanics: "scrapeoff", updateFrequencyInMs: 25 },
  };
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, rep.lengthInMs);
  const cstate = game.toClientGameState();
  const cell = cstate.cells.find((c) => c.id === 0);
  expect(cell?.playerId).toBe(0);
  expect(cell?.units).toBeLessThan(25);
});

test("test no membrane", () => {
  const rep: SpreadReplay = {
    ...Membrane.replay,
    players: [
      { id: 0, skills: [] },
      { id: 1, skills: [] },
    ],
  };
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, rep.lengthInMs);
  const cstate = game.toClientGameState();
  const cell = cstate.cells.find((c) => c.id === 0);
  expect(cell?.playerId).toBe(1);
});
