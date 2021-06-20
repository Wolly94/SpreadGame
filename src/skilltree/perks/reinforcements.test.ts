import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { ReinforcementsPerk } from "./reinforcements";
import { playersWithoutSkills } from "../oldperks/testHelper";

test("test reinforcements", () => {
  const rep: SpreadReplay = ReinforcementsPerk.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  const cstate = game.toClientGameState();
  const cell0 = cstate.cells.find((c) => c.id === 0);
  const cell1 = cstate.cells.find((c) => c.id === 1);
  if (cell1 === undefined) expect(true).toBe(false);
  else expect(cell0?.units).toBeGreaterThan(cell1.units);
});

test("test no reinforcements", () => {
  const rep: SpreadReplay = {
    ...ReinforcementsPerk.replay,
    players: playersWithoutSkills(2),
  };
  const game = SpreadGameImplementation.fromReplay(rep);
  const cstate = game.toClientGameState();
  const cell0 = cstate.cells.find((c) => c.id === 0);
  const cell1 = cstate.cells.find((c) => c.id === 1);
  if (cell1 === undefined) expect(true).toBe(false);
  else expect(cell0?.units).toBe(cell1.units);
});
