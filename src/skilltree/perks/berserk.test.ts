import { SpreadGameImplementation } from "../../spreadGame";
import { Berserk } from "./berserk";

test("test rage", () => {
  const rep = Berserk.replay;
  const game = SpreadGameImplementation.fromReplay(rep);
  game.runReplay(rep, 2000);
  var clientState = game.toClientGameState();
  const ragedBubbles = clientState.bubbles.filter(
    (bubble) => bubble.attackCombatAbilities > 1
  );
  expect(ragedBubbles.length).toBe(1);
  game.runReplay(rep, rep.lengthInMs);
  const c1 = game.cells.find((c) => c.id === 1);
  const c2 = game.cells.find((c) => c.id === 2);
  expect(c1?.playerId).toBe(1);
  expect(c2?.playerId).toBe(0);
  game.runReplay(rep, 3000);
});
