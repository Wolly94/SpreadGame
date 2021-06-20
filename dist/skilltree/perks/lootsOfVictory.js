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
var defendCell_1 = require("../../spreadGame/mechanics/events/defendCell");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Loots of Victory";
var defaultValues = [5, 10];
var defaultValue = 0;
exports.LootsOfVictoryPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "For every successful defense the cell gains + " +
                    utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
                    " population.";
            },
            triggers: [
                {
                    type: "DefendCell",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.before.cell.playerId, values, defaultValue);
                        var props = __assign(__assign({}, defendCell_1.defendCellUtils.default), { additionalUnits: val });
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "DefendCell",
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
        },
        players: [
            { id: 0, skills: [{ name: name, level: 2 }] },
            { id: 1, skills: [] },
        ],
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
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
    },
};
