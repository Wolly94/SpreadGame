"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame");
var berserk_1 = require("./berserk");
test("test rage", function () {
    var rep = berserk_1.Berserk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 2000);
    var clientState = game.toClientGameState();
    var ragedBubbles = clientState.bubbles.filter(function (bubble) { return bubble.attackCombatAbilities > 1; });
    expect(ragedBubbles.length).toBe(1);
    game.runReplay(rep, rep.lengthInMs);
    var c1 = game.cells.find(function (c) { return c.id === 1; });
    var c2 = game.cells.find(function (c) { return c.id === 2; });
    expect(c1 === null || c1 === void 0 ? void 0 : c1.playerId).toBe(1);
    expect(c2 === null || c2 === void 0 ? void 0 : c2.playerId).toBe(0);
    game.runReplay(rep, 3000);
});
