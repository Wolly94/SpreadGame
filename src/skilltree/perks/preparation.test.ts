import { SpreadGameImplementation } from "../../spreadGame";
import { Preparation } from "./preparation";

test("test preparation", () => {
  const rep = Preparation.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, 5000);
  var clientState = game.toClientGameState();
  let cell2 = clientState.cells.find((c) => c.id === 1);
  expect(cell2?.playerId).toBe(1);
});
