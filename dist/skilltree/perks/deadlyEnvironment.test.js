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
var deadlyEnvironment_1 = require("./deadlyEnvironment");
test("deadly environment", function () {
    var rep = deadlyEnvironment_1.DeadlyEnvironmentPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(1);
});
test("no deadly environment", function () {
    var rep = __assign(__assign({}, deadlyEnvironment_1.DeadlyEnvironmentPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(0);
});
