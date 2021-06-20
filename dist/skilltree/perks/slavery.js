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
var conquerCell_1 = require("../../spreadGame/mechanics/events/conquerCell");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Slavery";
var defaultValue = 0;
var defaultValues = [10, 20];
exports.SlaveryPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "Every newly conquered cell gains +" +
                    utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
                    " population.";
            },
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.after.cell.playerId, values, defaultValue);
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "ConquerCell",
                                props: {
                                    expirationInMs: "Never",
                                    value: __assign(__assign({}, conquerCell_1.conquerCellUtils.default), { additionalUnits: val }),
                                },
                            },
                        ];
                    },
                },
            ],
        };
    },
    replay: {
        gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
        lengthInMs: 5000,
        map: {
            width: 500,
            height: 500,
            cells: [
                {
                    id: 0,
                    playerId: 0,
                    position: [100, 100],
                    radius: 50,
                    units: 120,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: 50,
                    units: 50,
                },
            ],
            players: 2,
        },
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
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
        ],
    },
};
