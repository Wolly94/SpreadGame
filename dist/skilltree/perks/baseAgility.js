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
var move_1 = require("../../spreadGame/mechanics/events/move");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseAgility";
var defaultValue = 0;
var defaultValues = [20, 40, 60];
exports.BaseAgilityPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Base Agility",
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Velocity is increased by " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.after.bubble.playerId, values, defaultValue);
                        if (val === defaultValue)
                            return [];
                        return [
                            {
                                entity: {
                                    type: "Bubble",
                                    id: trigger.after.bubble.id,
                                },
                                perkName: name,
                                triggerType: "SendUnits",
                                props: {
                                    expirationInMs: "Never",
                                    value: __assign(__assign({}, move_1.moveUtils.default), { additionalSpeedInPercent: val }),
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
                    units: 100,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [100, 400],
                    radius: 50,
                    units: 100,
                },
                {
                    id: 2,
                    playerId: 0,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(100),
                    units: 100,
                },
                {
                    id: 3,
                    playerId: 1,
                    position: [400, 400],
                    radius: common_1.unitsToRadius(100),
                    units: 100,
                },
            ],
            players: 2,
        },
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 0,
                        senderIds: [0],
                        receiverId: 2,
                    },
                },
            },
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 1,
                        senderIds: [1],
                        receiverId: 3,
                    },
                },
            },
        ],
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
    },
};
