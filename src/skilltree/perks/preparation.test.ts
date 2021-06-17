import SpreadReplay from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import { PreparationPerk } from "./preparation";

test("test preparation", () => {
    const rep = PreparationPerk.replay;
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var clientState = game.toClientGameState();
    let cell2 = clientState.cells.find((c) => c.id === 1);
    expect(cell2?.playerId).toBe(1);
    expect(cell2?.defenderCombatAbilities).toBeGreaterThan(5);

    // check for reset after sent attack
    game.sendUnits(1, [1], 0);
    game.step(25);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find((c) => c.id === 1);
    expect(cell2?.playerId).toBe(1);
    expect(cell2?.defenderCombatAbilities).toBe(0);
});

test("test no preparation", () => {
    const rep = { ...PreparationPerk.replay, perks: [] };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var clientState = game.toClientGameState();
    const cell2 = clientState.cells.find((c) => c.id === 1);
    expect(cell2?.playerId).toBe(0);
});

test("test preparation cap", () => {
    const maxLength = 2000000;
    const rep: SpreadReplay = {
        ...PreparationPerk.replay,
        lengthInMs: maxLength,
    };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, maxLength / 2);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find((c) => c.id === 1);
    expect(cell2?.defenderCombatAbilities).toBe(100);
    const oldValue = cell2 === undefined ? 0 : cell2?.defenderCombatAbilities;
    game.runReplay(rep, 5000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find((c) => c.id === 1);
    expect(oldValue).toBe(cell2?.defenderCombatAbilities);
});
