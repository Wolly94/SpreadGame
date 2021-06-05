"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../../spreadGame/common");
var utils_1 = require("../utils");
var name = "Berserk";
var values = [
    [2000, 5],
    [2000, 10],
];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
        {
            id: 2,
            playerId: 1,
            position: [250, 400],
            radius: common_1.unitsToRadius(25),
            units: 25,
        },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [
        { id: 0, skills: [{ name: name, level: 2 }] },
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
            timestamp: 1000,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 2 },
            },
        },
    ],
};
var currentAttacksSent = function (lvl, attacker, eventHistory) {
    if (lvl <= 0)
        return 0;
    var val = values[Math.min(lvl, values.length) - 1];
    var toleratedTimeSpan = val[0];
    var attacksSentBeforeCreation = eventHistory.filter(function (ev) {
        return ev.data.type === "SendBubbleEvent" &&
            ev.data.sender.id === attacker.motherId &&
            ev.data.sender.playerId === attacker.playerId &&
            ev.timestamp >= attacker.creationTime - toleratedTimeSpan &&
            ev.timestamp < attacker.creationTime;
    });
    return attacksSentBeforeCreation.length;
};
exports.Berserk = {
    name: name,
    values: values,
    description: "For every consecutive (within " +
        utils_1.formatDescription(values, function (val) { return (val[0] / 1000).toString(); }, "/") +
        +" seconds after the last) attack a cell orders it's attack increases by " +
        utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
        ".",
    effect: [
        {
            type: "FightEffect",
            getValue: function (lvl, attacker, spreadGame) {
                if (lvl <= 0)
                    return { combatAbilityModifier: 0 };
                var attacksSent = currentAttacksSent(lvl, attacker, spreadGame.eventHistory);
                var val = values[Math.min(lvl, values.length) - 1];
                return {
                    combatAbilityModifier: val[1] * attacksSent,
                };
            },
        },
    ],
    replay: replay,
};
