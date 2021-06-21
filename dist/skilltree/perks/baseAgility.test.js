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
var baseAgility_1 = require("./baseAgility");
test("base agility", function () {
    var rep = baseAgility_1.BaseAgilityPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.gameSettings.updateFrequencyInMs);
    expect(game.bubbles.length).toBe(2);
    while (game.bubbles.length > 1) {
        game.step(rep.gameSettings.updateFrequencyInMs);
    }
    expect(game.bubbles.length).toBe(1);
    expect(game.timePassed).toBeLessThanOrEqual(1500);
});
test("no base agility", function () {
    var rep = __assign(__assign({}, baseAgility_1.BaseAgilityPerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.gameSettings.updateFrequencyInMs);
    expect(game.bubbles.length).toBe(2);
    while (game.bubbles.length > 1) {
        game.step(rep.gameSettings.updateFrequencyInMs);
    }
    expect(game.bubbles.length).toBe(0);
    expect(game.timePassed).toBeGreaterThan(1500);
});
