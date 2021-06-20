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
var preparation_1 = require("./preparation");
test("test preparation", function () {
    var rep = preparation_1.PreparationPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBeGreaterThan(5);
    // check for reset after sent attack
    game.sendUnits(1, [1], 0);
    game.step(25);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(1);
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(0);
});
test("test no preparation", function () {
    var rep = __assign(__assign({}, preparation_1.PreparationPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.playerId).toBe(0);
});
test("test preparation cap", function () {
    var maxLength = 2000000;
    var rep = __assign(__assign({}, preparation_1.PreparationPerk.replay), { lengthInMs: maxLength });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, maxLength / 2);
    var clientState = game.toClientGameState();
    var cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities).toBe(100);
    var oldValue = cell2 === undefined ? 0 : cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities;
    game.runReplay(rep, 5000);
    clientState = game.toClientGameState();
    cell2 = clientState.cells.find(function (c) { return c.id === 1; });
    expect(oldValue).toBe(cell2 === null || cell2 === void 0 ? void 0 : cell2.defenderCombatAbilities);
});
