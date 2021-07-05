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
var common_1 = require("../../spreadGame/common");
var conquerCell_1 = require("../../spreadGame/mechanics/events/conquerCell");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Kamikaze";
var defaultValues = [0.8, 0.5];
var defaultValue = 1;
exports.KamikazePerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "When a cell is lost only " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    " of the conquering army remains.";
            },
            triggers: [
                {
                    type: "CapturedCell",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.beforePlayerId, values, defaultValue);
                        var props = __assign(__assign({}, conquerCell_1.conquerCellUtils.default), { unitsInPercentToRemain: val });
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: name,
                                props: {
                                    expirationInMs: "Never",
                                    value: props,
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
                    units: 50,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(100),
                    units: 200,
                },
            ],
            players: 2,
        },
        players: [
            { id: 0, skills: [{ name: name, level: 1 }] },
            { id: 1, skills: [] },
        ],
        perks: [{ name: name, data: { type: "number", val: [0.5] } }],
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 1, senderIds: [1], receiverId: 0 },
                },
            },
        ],
    },
};
