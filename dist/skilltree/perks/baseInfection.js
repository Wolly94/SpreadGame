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
var attackerDefendCell_1 = require("../../spreadGame/gameProps/attackerDefendCell");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseInfection";
var values = [0.01, 0.03, 0.05];
var defaultValue = 0;
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
        { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 50 },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [
        { id: 0, skills: [{ name: name, level: 3 }] },
        { id: 1, skills: [] },
    ],
    moveHistory: [
        {
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 1 },
            },
        },
        {
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [1], receiverId: 0 },
            },
        },
        {
            timestamp: 1000,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 2 },
            },
        },
    ],
};
exports.BaseInfection = {
    name: name,
    values: values,
    description: "Cells you attacked stop growing for " +
        utils_1.formatDescription(values, function (val) { return "#attacker/" + (1 / val).toString(); }, ", ") +
        " seconds.",
    effects: [
        {
            type: "AttackerDefendCellEffect",
            getValue: function (lvl, trigger, spreadGame) {
                var fightEvents = spreadGame.eventHistory.filter(function (ev) {
                    return ev.data.type === "FightEvent" &&
                        ev.data.before.attacker.playerId === trigger.attackerPlayerId &&
                        ev.data.before.defender.type === "Cell" &&
                        ev.data.before.defender.val.id === trigger.defender.id;
                });
                var finishedFightEvents = fightEvents.filter(function (ev) { return ev.data.finished && ev.data.after.attacker === null; });
                var val = perk_1.getValue(values, lvl, defaultValue);
                var blocked = finishedFightEvents.reduce(function (prev, curr) {
                    var timeBlockedInMs = curr.data.before.attacker.units * val * 1000;
                    return Math.max(prev, curr.timestamp + timeBlockedInMs - spreadGame.timePassed);
                }, 0);
                return __assign(__assign({}, attackerDefendCell_1.attackerDefendCellUtils), { blockGrowthInMs: blocked });
            },
        },
    ],
    replay: replay,
};
