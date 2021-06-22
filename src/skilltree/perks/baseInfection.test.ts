import { SpreadGameImplementation } from "../../spreadGame";
import { BaseInfectionPerk } from "./baseInfection";

test("base infection", () => {
    const rep = BaseInfectionPerk.replay;
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1500);
    let cstate = game.toClientGameState();
    let cell1 = cstate.cells.find((c) => c.id === 1);
    const unitsAfter =
        cell1?.data?.units === undefined ? -1 : cell1?.data?.units;

    game.runReplay(rep, 1000);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find((c) => c.id === 1);
    expect(cell1?.data?.units).toBe(unitsAfter);

    game.run(1500, 25);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find((c) => c.id === 1);
    expect(cell1?.data?.units).toBeGreaterThan(unitsAfter + 2);
});

test("no base infection", () => {
    const rep = { ...BaseInfectionPerk.replay, perks: [] };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1500);
    let cstate = game.toClientGameState();
    let cell1 = cstate.cells.find((c) => c.id === 1);
    const unitsAfter =
        cell1?.data?.units === undefined ? -1 : cell1?.data?.units;

    game.runReplay(rep, 1000);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find((c) => c.id === 1);
    expect(cell1?.data?.units).not.toBe(unitsAfter);
});
