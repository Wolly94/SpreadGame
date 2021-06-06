"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var name = "BaseDefense";
var values = [10, 20, 30];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 120 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [
        { id: 0, skills: [] },
        { id: 1, skills: [{ name: name, level: 3 }] },
    ],
    moveHistory: [
        {
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 0, senderIds: [0], receiverId: 1 },
            },
        },
    ],
};
exports.BaseDefense = {
    name: name,
    values: values,
    description: "Raises combat abilities of your cells by " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        ".",
    effects: [
        {
            type: "DefenderFightEffect",
            getValue: function (lvl) {
                if (lvl <= 0)
                    return { combatAbilityModifier: 0 };
                else
                    return {
                        combatAbilityModifier: values[Math.min(lvl, values.length) - 1],
                    };
            },
        },
    ],
    replay: replay,
};
