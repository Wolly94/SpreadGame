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
var common_1 = require("../../spreadGame/common");
var membrane_1 = require("./membrane");
test("test membrane", function () {
    var _a, _b;
    var rep = __assign(__assign({}, membrane_1.MembranePerk.replay), { gameSettings: { mechanics: "scrapeoff", updateFrequencyInMs: 25 } });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell === null || cell === void 0 ? void 0 : cell.playerId).toBe(0);
    expect((_a = cell === null || cell === void 0 ? void 0 : cell.data) === null || _a === void 0 ? void 0 : _a.membraneValue).toBeGreaterThan(5);
    expect((_b = cell === null || cell === void 0 ? void 0 : cell.data) === null || _b === void 0 ? void 0 : _b.units).toBeLessThan(25);
});
test("membrane visual", function () {
    var _a;
    var rep = __assign(__assign({}, membrane_1.MembranePerk.replay), { map: __assign(__assign({}, membrane_1.MembranePerk.replay.map), { cells: [
                {
                    id: 0,
                    playerId: 0,
                    position: [100, 100],
                    radius: common_1.unitsToRadius(50),
                    units: 100,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(40),
                    units: 40,
                },
            ] }), moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: { senderIds: [0], receiverId: 1, playerId: 0 },
                },
            },
        ] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell1 = cstate.cells.find(function (c) { return c.id === 1; });
    expect(cell1 === null || cell1 === void 0 ? void 0 : cell1.playerId).toBe(0);
    expect((_a = cell1 === null || cell1 === void 0 ? void 0 : cell1.data) === null || _a === void 0 ? void 0 : _a.membraneValue).toBeGreaterThan(5);
});
test("test no membrane", function () {
    var rep = __assign(__assign({}, membrane_1.MembranePerk.replay), { players: [
            { id: 0, skills: [] },
            { id: 1, skills: [] },
        ] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, rep.lengthInMs);
    var cstate = game.toClientGameState();
    var cell = cstate.cells.find(function (c) { return c.id === 0; });
    expect(cell === null || cell === void 0 ? void 0 : cell.playerId).toBe(1);
});
