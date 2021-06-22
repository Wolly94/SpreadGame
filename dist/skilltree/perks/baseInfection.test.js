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
var baseInfection_1 = require("./baseInfection");
test("base infection", function () {
    var _a, _b, _c, _d;
    var rep = baseInfection_1.BaseInfectionPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1500);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    var unitsAfter = ((_a = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _a === void 0 ? void 0 : _a.units) === undefined ? -1 : (_b = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _b === void 0 ? void 0 : _b.units;
    game.runReplay(rep, 1000);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect((_c = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _c === void 0 ? void 0 : _c.units).toBe(unitsAfter);
    game.run(1500, 25);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect((_d = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _d === void 0 ? void 0 : _d.units).toBeGreaterThan(unitsAfter + 2);
});
test("no base infection", function () {
    var _a, _b, _c;
    var rep = __assign(__assign({}, baseInfection_1.BaseInfectionPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1500);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    var unitsAfter = ((_a = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _a === void 0 ? void 0 : _a.units) === undefined ? -1 : (_b = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _b === void 0 ? void 0 : _b.units;
    game.runReplay(rep, 1000);
    cstate = game.toClientGameState();
    cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect((_c = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _c === void 0 ? void 0 : _c.units).not.toBe(unitsAfter);
});
