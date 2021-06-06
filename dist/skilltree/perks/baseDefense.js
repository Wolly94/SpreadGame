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
var spreadGameProps_1 = require("../../spreadGame/spreadGameProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseDefense";
var values = [10, 20, 30];
var defaultValue = 0;
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
                var val = perk_1.getValue(values, lvl, defaultValue);
                return __assign(__assign({}, spreadGameProps_1.combineDefenderFightProps.default), { combatAbilityModifier: val });
            },
        },
    ],
    replay: replay,
};
