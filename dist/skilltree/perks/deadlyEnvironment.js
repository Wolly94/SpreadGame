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
var visualizeGameProps_1 = require("../../spreadGame/mechanics/events/visualizeGameProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "DeadlyEnvironment";
var defaultValue = 0;
var defaultValues = [1, 2];
exports.DeadlyEnvironmentPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Deadly Environment",
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Enemy bubbles decrease in population over time. (" +
                    utils_1.formatDescription(values, function (val) { return "-" + val.toString(); }, "/") +
                    " units/second)";
            },
            triggers: [
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        return [
                            {
                                entity: { type: "Game", id: null },
                                perkName: name,
                                triggerType: "StartGame",
                                props: {
                                    expirationInMs: "Never",
                                    value: __assign(__assign({}, visualizeGameProps_1.visualizeGameUtils.default), { deadlyEnvironment: true }),
                                },
                            },
                        ];
                    },
                },
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var bubblePlayerId = trigger.after.bubble.playerId;
                        var val = game.players
                            .filter(function (pl) { return pl.id !== bubblePlayerId; })
                            .map(function (pl) {
                            return perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                        })
                            .reduce(function (prev, curr) { return Math.max(prev, curr); }, defaultValue);
                        if (val === defaultValue)
                            return [];
                        return [
                            {
                                entity: {
                                    type: "Bubble",
                                    id: trigger.after.bubble.id,
                                },
                                perkName: name,
                                triggerType: "CreateBubble",
                                props: {
                                    expirationInMs: "Never",
                                    value: __assign(__assign({}, move_1.moveUtils.default), { unitLossPerSecond: val }),
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
                    position: [400, 100],
                    radius: common_1.unitsToRadius(49),
                    units: 49,
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
    },
};
