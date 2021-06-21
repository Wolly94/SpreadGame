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
var camouflage_1 = require("./camouflage");
test("camouflage", function () {
    var rep = camouflage_1.CamouflagePerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    var cstate1 = game.toClientGameState(1);
    var cell11 = cstate1.cells.find(function (c) { return c.id === 0; });
    var cell12 = cstate1.cells.find(function (c) { return c.id === 1; });
    var bubble1 = cstate1.bubbles.find(function (c) { return c.id === 1; });
    expect(bubble1 === null || bubble1 === void 0 ? void 0 : bubble1.data).toBe(null);
    expect(cell11 === null || cell11 === void 0 ? void 0 : cell11.data).toBe(null);
    expect(cell12 === null || cell12 === void 0 ? void 0 : cell12.data).not.toBe(null);
});
test("no camouflage", function () {
    var rep = __assign(__assign({}, camouflage_1.CamouflagePerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    var cstate1 = game.toClientGameState(1);
    var cell11 = cstate1.cells.find(function (c) { return c.id === 0; });
    var bubble1 = cstate1.bubbles.find(function (c) { return c.id === 1; });
    expect(bubble1 === null || bubble1 === void 0 ? void 0 : bubble1.data).not.toBe(null);
    expect(cell11 === null || cell11 === void 0 ? void 0 : cell11.data).not.toBe(null);
});
