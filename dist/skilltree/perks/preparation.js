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
var common_1 = require("../../spreadGame/common");
var spreadGameProps_1 = require("../../spreadGame/spreadGameProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Preparation";
var values = [
    [1, 50],
    [2, 100],
];
var defaultValue = [0, 0];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        {
            id: 0,
            playerId: 0,
            position: [200, 200],
            radius: common_1.unitsToRadius(204),
            units: 204,
        },
        {
            id: 1,
            playerId: 1,
            position: [400, 100],
            radius: common_1.unitsToRadius(100),
            units: 100,
        },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [
        { id: 0, skills: [] },
        { id: 1, skills: [{ name: name, level: 2 }] },
    ],
    moveHistory: [
        {
            timestamp: 2000,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 1 },
            },
        },
    ],
};
var latestMoveTimeStamp = function (cell, eventHistory) {
    var lastAttackSent = eventHistory
        .filter(function (ev) {
        return ev.data.type === "SendBubbleEvent" && ev.data.sender.id === cell.id;
    })
        .slice(-1)[0];
    var lastConquered = eventHistory
        .filter(function (ev) {
        return ev.data.type === "FightEvent" &&
            ev.data.defender.type === "Cell" &&
            ev.data.defender.after.id === cell.id &&
            ev.data.defender.before.playerId !== ev.data.defender.after.playerId;
    })
        .slice(-1)[0];
    var latestTimeStamp = Math.max(lastAttackSent === undefined ? 0 : lastAttackSent.timestamp, lastConquered === undefined ? 0 : lastConquered.timestamp);
    return latestTimeStamp;
};
exports.Preparation = {
    name: name,
    values: values,
    description: "Raises combat abilities of your cells by " +
        utils_1.formatDescription(values, function (val) { return val[0].toString() + "%"; }, "/") +
        " for each second that cell did not send an attack, capped at " +
        utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
        ".",
    effects: [
        {
            type: "DefenderFightEffect",
            getValue: function (lvl, defender, spreadGame) {
                var val = perk_1.getValue(values, lvl, defaultValue);
                var idleSince = latestMoveTimeStamp(defender, spreadGame.eventHistory);
                return __assign(__assign({}, spreadGameProps_1.combineDefenderFightProps.default), { combatAbilityModifier: Math.min((val[0] * (spreadGame.timePassed - idleSince)) / 1000, val[1]) });
            },
        },
    ],
    replay: replay,
};
