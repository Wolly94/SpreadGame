"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var name = "BaseAttack";
var values = [10, 20, 30];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
        { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 100 },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
    players: [{ id: 0, skills: [{ name: name, level: 3 }] }],
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
exports.BaseAttack = {
    name: name,
    values: values,
    description: "Raises damage of your bubbles by " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        ".",
    effect: [
        {
            type: "FightEffect",
            getValue: function (lvl) {
                if (lvl <= 0)
                    return { attackModifier: 0 };
                else
                    return { attackModifier: values[Math.min(lvl, values.length) - 1] };
            },
        },
    ],
    replay: replay,
};
exports.Attack = {
    name: "Attack",
    perks: [exports.BaseAttack],
};
