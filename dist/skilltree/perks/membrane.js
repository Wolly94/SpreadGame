"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../../spreadGame/common");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Membrane";
var values = [10];
var defaultValue = 0;
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        {
            id: 0,
            playerId: 0,
            position: [100, 100],
            radius: common_1.unitsToRadius(40),
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
        { id: 0, skills: [{ name: name, level: 1 }] },
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
            timestamp: 0,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [2], receiverId: 0 },
            },
        },
    ],
};
exports.Membrane = {
    name: name,
    values: values,
    description: "The first " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        " of every attacking enemy bubble die to the membrane before doing damage.",
    effects: [
        {
            type: "DefenderFightEffect",
            getValue: function (lvl) {
                var val = perk_1.getValue(values, lvl, defaultValue);
                return {
                    combatAbilityModifier: 0,
                    membraneAbsorption: val,
                };
            },
        },
    ],
    replay: replay,
};
