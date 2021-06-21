import { SpreadGameImplementation } from "../../spreadGame";
import { CamouflagePerk } from "./camouflage";

test("camouflage", () => {
    const rep = CamouflagePerk.replay;
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    const cstate1 = game.toClientGameState(1);
    const cell11 = cstate1.cells.find((c) => c.id === 0);
    const bubble1 = cstate1.bubbles.find((c) => c.id === 1);
    expect(bubble1?.data).toBe(null);
    expect(cell11?.data).toBe(null);
});

test("no camouflage", () => {
    const rep = { ...CamouflagePerk.replay, perks: [] };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    const cstate1 = game.toClientGameState(1);
    const cell11 = cstate1.cells.find((c) => c.id === 0);
    const bubble1 = cstate1.bubbles.find((c) => c.id === 1);
    expect(bubble1?.data).not.toBe(null);
    expect(cell11?.data).not.toBe(null);
});
