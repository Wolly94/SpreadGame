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
var slavery_1 = require("./slavery");
test("test slavery", function () {
    var rep = slavery_1.SlaveryPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 2000);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    game.runReplay(rep, 1000);
    var clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(0);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.units).toBeGreaterThanOrEqual(20);
});
test("test no slavery", function () {
    var rep = __assign(__assign({}, slavery_1.SlaveryPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 2000);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    game.runReplay(rep, 1000);
    var clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(0);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.units).toBeLessThanOrEqual(11);
});
