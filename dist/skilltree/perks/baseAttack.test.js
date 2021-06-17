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
var spreadGame_1 = require("../../spreadGame/spreadGame");
var baseAttack_1 = require("./baseAttack");
test("test base attack", function () {
    var rep = baseAttack_1.BaseAttackPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(0);
});
test("test no base attack", function () {
    var rep = __assign(__assign({}, baseAttack_1.BaseAttackPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 5000);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(1);
});
