import { SpreadGameImplementation } from "../../spreadGame";
import { CamouflagePerk } from "./camouflage";

test("camouflage", () => {
    const rep = CamouflagePerk.replay;
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    const cstate1 = game.toClientGameState(0);
    const cell11 = cstate1.cells.find((c) => c.id === 0);
    const cell12 = cstate1.cells.find((c) => c.id === 1);
    const bubble1 = cstate1.bubbles.find((c) => c.id === 1);
    expect(bubble1?.data).toBe(null);
    expect(cell11?.data).not.toBe(null);
    expect(cell12?.data).toBe(null);

    const cstate2 = game.toClientGameState(1);
    const cell21 = cstate2.cells.find((c) => c.id === 0);
    const cell22 = cstate2.cells.find((c) => c.id === 1);
    const bubble2 = cstate2.bubbles.find((c) => c.id === 1);
    expect(bubble2?.data).not.toBe(null);
    expect(cell21?.data).not.toBe(null);
    expect(cell22?.data).not.toBe(null);

    game.runReplay(rep, 4000);
    const gameCell0 = game.cells.find((c) => c.id === 0);
    expect(gameCell0?.playerId).toBe(1);
});

test("no camouflage", () => {
    const rep = { ...CamouflagePerk.replay, perks: [] };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    const cstate1 = game.toClientGameState(0);
    const cell11 = cstate1.cells.find((c) => c.id === 0);
    const bubble1 = cstate1.bubbles.find((c) => c.id === 1);
    expect(bubble1?.data).not.toBe(null);
    expect(cell11?.data).not.toBe(null);
});
