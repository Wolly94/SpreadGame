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
var basePopulation_1 = require("./basePopulation");
var fertileGrounds_1 = require("./fertileGrounds");
var testHelper_1 = require("./testHelper");
test("test fertile grounds", function () {
    var rep = fertileGrounds_1.FertileGrounds.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    if (cell1 === undefined)
        expect(true).toBe(false);
    else
        expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.units).toBeGreaterThan(cell1.units);
});
test("test no fertile grounds", function () {
    var rep = __assign(__assign({}, basePopulation_1.BasePopulation.replay), { players: testHelper_1.playersWithoutSkills(2) });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    if (cell1 === undefined)
        expect(true).toBe(false);
    else
        expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.units).toBe(cell1.units);
});
