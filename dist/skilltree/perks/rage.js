"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var name = "Rage";
var values = [
    [2000, 20],
    [3000, 30],
];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
        { id: 1, playerId: 0, position: [400, 100], radius: 50, units: 10 },
        { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 100 },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [
        { id: 0, skills: [{ name: name, level: 1 }] },
        { id: 1, skills: [] },
    ],
    moveHistory: [
        {
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [2], receiverId: 1 },
            },
        },
        {
            timestamp: 2000,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 2 },
            },
        },
    ],
};
var rageCondition = function (lvl, eventHistory, timePassed, playerId) {
    if (lvl <= 0)
        return false;
    var val = values[Math.min(lvl, values.length) - 1];
    var toleratedTimeSpan = val[0];
    var lostCellEvents = eventHistory.filter(function (ev) {
        return ev.timestamp >= timePassed - toleratedTimeSpan &&
            ev.data.type === "FightEvent" &&
            ev.data.defender.type === "Cell" &&
            ev.data.defender.before.playerId === playerId &&
            ev.data.defender.after.playerId !== playerId;
    });
    return lostCellEvents.length > 0;
};
exports.Rage = {
    name: name,
    values: values,
    description: "Whenever a friendly cell is lost, combat abilities of all currently existing bubbles are increased by " +
        utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
        " for " +
        utils_1.formatDescription(values, function (val) { return (val[0] / 1000).toString(); }, "/") +
        " seconds.",
    effects: [
        {
            type: "AttackerFightEffect",
            getValue: function (lvl, attacker, spreadGame) {
                if (rageCondition(lvl, spreadGame.eventHistory, spreadGame.timePassed, attacker.playerId)) {
                    var val = values[Math.min(lvl, values.length) - 1];
                    return {
                        combatAbilityModifier: val[1],
                    };
                }
                else {
                    return { combatAbilityModifier: 0 };
                }
            },
        },
    ],
    replay: replay,
};
