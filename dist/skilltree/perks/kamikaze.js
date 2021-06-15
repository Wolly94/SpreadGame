"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Kamikaze";
var values = [0.8, 0.5];
var defaultValue = 1;
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 50 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 200 },
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
    ],
};
exports.Kamikaze = {
    name: name,
    values: values,
    description: "When a cell is lost only " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        +" of the conquering army remains.",
    effects: [
        {
            type: "DefenderConquerCellEffect",
            getValue: function (lvl) {
                var val = perk_1.getValue(values, lvl, defaultValue);
                return {
                    unitsInPercentToRemain: val,
                };
            },
        },
    ],
    replay: replay,
};
