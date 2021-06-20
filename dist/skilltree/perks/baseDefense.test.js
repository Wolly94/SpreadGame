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
var baseDefense_1 = require("./baseDefense");
test("test baseDefense", function () {
    var rep = baseDefense_1.BaseDefensePerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(30);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    game.runReplay(rep, 1000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(30);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(0);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(0);
});
test("test no baseDefense", function () {
    var rep = __assign(__assign({}, baseDefense_1.BaseDefensePerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(0);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    game.runReplay(rep, 1000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(0);
});
