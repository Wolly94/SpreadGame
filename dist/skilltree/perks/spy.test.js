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
var spy_1 = require("./spy");
test("spy", function () {
    var rep = spy_1.SpyPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.defenderCombatAbilities).toBeGreaterThan(1);
    var skills = game.getSkilledPerks(0);
    expect(skills.length).toBe(2);
});
test("no spy", function () {
    var rep = __assign(__assign({}, spy_1.SpyPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell0 = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell0 === null || cell0 === void 0 ? void 0 : cell0.defenderCombatAbilities).toBe(0);
    var skills = game.getSkilledPerks(0);
    expect(skills.length).toBe(1);
});
