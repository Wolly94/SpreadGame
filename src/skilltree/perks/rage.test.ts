import { SpreadGameImplementation } from "../../spreadGame";
import { Rage } from "./rage";

test("test rage", () => {
  const rep = Rage.replay;
  const game = SpreadGameImplementation.fromReplay(Rage.replay);
  game.runReplay(rep, 3000);
  var clientState = game.toClientGameState();
  const ragedBubbles = clientState.bubbles.filter(
    (bubble) => bubble.attackCombatAbilities > 1
  );
  expect(ragedBubbles.length).toBe(1);
  game.runReplay(rep, 2000);
  clientState = game.toClientGameState();
  const secondLostCell = clientState.cells.find((ce) => ce.id === 2);
  expect(secondLostCell?.playerId).toBe(0);
});
