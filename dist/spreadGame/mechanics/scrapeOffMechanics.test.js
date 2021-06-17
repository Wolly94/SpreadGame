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
var __1 = require("..");
var baseAttack_1 = require("../perks/baseAttack");
var perk_1 = require("../perks/perk");
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: {
        width: 500,
        height: 500,
        players: 2,
        cells: [
            { id: 0, position: [100, 100], radius: 50, playerId: 0, units: 50 },
            { id: 1, position: [100, 400], radius: 50, playerId: 1, units: 30 },
        ],
    },
    players: [
        { id: 0, skills: [{ level: 2, name: "BaseAttack" }] },
        { id: 1, skills: [] },
    ],
    perks: [perk_1.backupFromPerk(baseAttack_1.BaseAttackPerk.createFromValues())],
    moveHistory: [
        {
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, receiverId: 1, senderIds: [0] },
            },
        },
    ],
};
test("scrape off vs basic", function () {
    var rep1 = replay;
    var rep2 = __assign(__assign({}, replay), { gameSettings: __assign(__assign({}, replay.gameSettings), { mechanics: "scrapeoff" }) });
    var game1 = __1.SpreadGameImplementation.fromReplay(rep1);
    var game2 = __1.SpreadGameImplementation.fromReplay(rep2);
    game1.runReplay(rep1, 5000);
    game2.runReplay(rep2, 5000);
    var cstate1 = game1.toClientGameState();
    var cstate2 = game2.toClientGameState();
    var cell21 = cstate1.cells.find(function (c) { return c.id === 1; });
    var cell22 = cstate2.cells.find(function (c) { return c.id === 1; });
    expect(cell21 === null || cell21 === void 0 ? void 0 : cell21.units).toBeCloseTo(cell22 === undefined ? -1 : cell22.units, 5);
});
