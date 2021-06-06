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
var membrane_1 = require("./membrane");
test("test membrane", function () {
    var rep = membrane_1.Membrane.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell === null || cell === void 0 ? void 0 : cell.playerId).toBe(0);
});
test("test no membrane", function () {
    var rep = __assign(__assign({}, membrane_1.Membrane.replay), { players: [
            { id: 0, skills: [] },
            { id: 1, skills: [] },
        ] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell === null || cell === void 0 ? void 0 : cell.playerId).toBe(1);
});
