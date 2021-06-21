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
var kamikaze_1 = require("./kamikaze");
test("test kamikaze", function () {
    var _a;
    var rep = kamikaze_1.KamikazePerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.playerId).toBe(0);
    game.runReplay(rep, 3000);
    cstate = game.toClientGameState();
    cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.playerId).toBe(1);
    expect((_a = cell0 === null || cell0 === void 0 ? void 0 : cell0.data) === null || _a === void 0 ? void 0 : _a.units).toBeLessThan(30);
});
test("test no kamikaze", function () {
    var _a;
    var rep = __assign(__assign({}, kamikaze_1.KamikazePerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.playerId).toBe(0);
    game.runReplay(rep, 3000);
    cstate = game.toClientGameState();
    cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.playerId).toBe(1);
    expect((_a = cell0 === null || cell0 === void 0 ? void 0 : cell0.data) === null || _a === void 0 ? void 0 : _a.units).toBe(50);
});
