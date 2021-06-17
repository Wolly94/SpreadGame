"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame");
var berserk_1 = require("./berserk");
test("test rage", function () {
    var rep = berserk_1.BerserkPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 2000);
    var clientState = game.toClientGameState();
    var ragedBubbles = clientState.bubbles.filter(function (bubble) { return bubble.attackCombatAbilities > 0; });
    var ragedCell = clientState.cells.find(function (c) { return c.attackerCombatAbilities > 0; });
    expect(ragedCell === null || ragedCell === void 0 ? void 0 : ragedCell.attackerCombatAbilities).toBe(30);
    expect(ragedBubbles.length).toBe(2);
    expect(ragedBubbles[0].attackCombatAbilities).toBe(10);
    expect(ragedBubbles[1].attackCombatAbilities).toBe(20);
    game.runReplay(rep, 1000);
    var c1 = game.cells.find(function (c) { return c.id === 1; });
    expect(c1 === null || c1 === void 0 ? void 0 : c1.playerId).toBe(1);
    game.runReplay(rep, 1000);
    clientState = game.toClientGameState();
    ragedBubbles = clientState.bubbles.filter(function (bubble) { return bubble.attackCombatAbilities > 0; });
    expect(clientState.bubbles.length).toBe(1);
    expect(ragedBubbles.length).toBe(0);
    game.runReplay(rep, 1000);
    c1 = game.cells.find(function (c) { return c.id === 1; });
    var c2 = game.cells.find(function (c) { return c.id === 2; });
    expect(c1 === null || c1 === void 0 ? void 0 : c1.playerId).toBe(0);
    expect(c2 === null || c2 === void 0 ? void 0 : c2.playerId).toBe(0);
});
test("test no rage", function () {
    var rep = __assign(__assign({}, berserk_1.BerserkPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 3000);
    var clientState = game.toClientGameState();
    var c1 = clientState.cells.find(function (c) { return c.id === 1; });
    var c2 = clientState.cells.find(function (c) { return c.id === 2; });
    expect(c1 === null || c1 === void 0 ? void 0 : c1.playerId).toBe(1);
    expect(c2 === null || c2 === void 0 ? void 0 : c2.playerId).toBe(1);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    c1 = clientState.cells.find(function (c) { return c.id === 1; });
    c2 = clientState.cells.find(function (c) { return c.id === 2; });
    expect(c1 === null || c1 === void 0 ? void 0 : c1.playerId).toBe(0);
    expect(c2 === null || c2 === void 0 ? void 0 : c2.playerId).toBe(1);
});
