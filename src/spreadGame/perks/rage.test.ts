import { SpreadGameImplementation } from "..";
import { RagePerk } from "./rage";

test("test rage", () => {
    const rep = RagePerk.replay;
    const game = SpreadGameImplementation.fromReplay(RagePerk.replay);
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

test("test no rage", () => {
    const rep = { ...RagePerk.replay, perks: [] };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 3000);
    var clientState = game.toClientGameState();
    const ragedBubbles = clientState.bubbles.filter(
        (bubble) => bubble.attackCombatAbilities > 1
    );
    expect(ragedBubbles.length).toBe(0);
});
