"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../../spreadGame/common");
var utils_1 = require("../utils");
var name = "Loots of Victory";
var values = [5, 10];
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        {
            id: 0,
            playerId: 0,
            position: [100, 100],
            radius: common_1.unitsToRadius(45),
            units: 45,
        },
        {
            id: 1,
            playerId: 1,
            position: [400, 100],
            radius: common_1.unitsToRadius(50),
            units: 50,
        },
        {
            id: 2,
            playerId: 1,
            position: [100, 400],
            radius: common_1.unitsToRadius(50),
            units: 50,
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
                data: { playerId: 1, senderIds: [1], receiverId: 0 },
            },
        },
        {
            timestamp: 25,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [2], receiverId: 0 },
            },
        },
    ],
};
exports.LootsOfVictory = {
    name: name,
    values: values,
    description: "For every successful defense the cell gains + " +
        utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
        " population.",
    effects: [
        {
            type: "DefendCellEffect",
            getValue: function (lvl) {
                if (lvl <= 0)
                    return { additionalUnits: 0 };
                else {
                    var val = values[Math.min(lvl, values.length) - 1];
                    return {
                        additionalUnits: val,
                    };
                }
            },
        },
    ],
    replay: replay,
};
