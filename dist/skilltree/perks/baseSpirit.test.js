"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame");
var baseSpirit_1 = require("./baseSpirit");
test("test base spirit", function () {
    var _a, _b, _c, _d;
    var rep = baseSpirit_1.BaseSpiritPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    expect(game.bubbles.length).toBe(2);
    var clientState = game.toClientGameState();
    var cell0 = clientState.cells.find(function (c) { return c.id === 0; });
    var bubble1 = clientState.bubbles.find(function (b) { return b.id === 1; });
    expect((_a = cell0 === null || cell0 === void 0 ? void 0 : cell0.data) === null || _a === void 0 ? void 0 : _a.defenderCombatAbilities).toBe(1 * 6);
    expect((_b = bubble1 === null || bubble1 === void 0 ? void 0 : bubble1.data) === null || _b === void 0 ? void 0 : _b.attackCombatAbilities).toBe(1 * 6);
    while (game.bubbles.length >= 2) {
        game.step(25);
    }
    expect(game.bubbles.length).toBe(1);
    clientState = game.toClientGameState();
    var cell1 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(0);
    var bubble2 = clientState.bubbles.find(function (b) { return b.id === 2; });
    expect((_c = bubble2 === null || bubble2 === void 0 ? void 0 : bubble2.data) === null || _c === void 0 ? void 0 : _c.attackCombatAbilities).toBe(0);
    cell0 = clientState.cells.find(function (c) { return c.id === 0; });
    expect((_d = cell0 === null || cell0 === void 0 ? void 0 : cell0.data) === null || _d === void 0 ? void 0 : _d.defenderCombatAbilities).toBe(0 * 6);
    bubble1 = clientState.bubbles.find(function (b) { return b.id === 1; });
    expect(bubble1).toBe(undefined);
    while (game.bubbles.length >= 1) {
        game.step(25);
    }
    expect(game.bubbles.length).toBe(0);
    clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 2; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
});
