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
var defenderStart_1 = require("../../spreadGame/gameProps/defenderStart");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Reinforcements";
var values = [9, 15];
var defaultValue = 0;
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 10 },
        { id: 1, playerId: 1, position: [400, 400], radius: 50, units: 10 },
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
    moveHistory: [],
};
exports.Reinforcements = {
    name: name,
    values: values,
    description: "At the beginning, every friendly cell starts with +" +
        utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
        " population.",
    effects: [
        {
            type: "DefenderStartEffect",
            getValue: function (lvl, trigger, spreadGame) {
                var val = perk_1.getValue(values, lvl, defaultValue);
                return __assign(__assign({}, defenderStart_1.defenderStartUtils.default), { additionalUnits: val });
            },
        },
    ],
    replay: replay,
};
