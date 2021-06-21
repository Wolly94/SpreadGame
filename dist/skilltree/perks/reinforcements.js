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
var startGame_1 = require("../../spreadGame/mechanics/events/startGame");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Reinforcements";
var defaultValues = [9, 15];
var defaultValue = 0;
exports.ReinforcementsPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: defaultValues,
            description: function (lvl) {
                return "At the beginning, every friendly cell starts with +" +
                    utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
                    " population.";
            },
            triggers: [
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (pl) {
                            var val = perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                            var res2 = game.cells
                                .filter(function (cell) { return cell.playerId === pl.id; })
                                .map(function (cell) {
                                return {
                                    entity: {
                                        type: "Cell",
                                        id: cell.id,
                                    },
                                    perkName: name,
                                    triggerType: "StartGame",
                                    props: {
                                        expirationInMs: "Never",
                                        value: __assign(__assign({}, startGame_1.startGameCellUtils.default), { additionalUnits: val }),
                                    },
                                };
                            });
                            return res2;
                        });
                        return res;
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
                    units: 10,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 400],
                    radius: 50,
                    units: 10,
                },
            ],
            players: 2,
        },
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
        perks: [{ name: name, data: { type: "number", val: defaultValues } }],
        moveHistory: [],
    },
};
