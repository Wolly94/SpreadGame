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
var growth_1 = require("../../spreadGame/mechanics/events/growth");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BasePopulation";
var defaultValues = [20, 40, 60];
var defaultValue = 0;
var getReturnValue = function (cellId, additionalCapacity) {
    var props = __assign(__assign({}, growth_1.growthUtils.default), { additionalCapacity: additionalCapacity });
    var res = {
        entity: { type: "Cell", id: cellId },
        perkName: name,
        triggerType: "Conquer",
        props: {
            expirationInMs: "Never",
            value: props,
        },
    };
    return res;
};
exports.BasePopulationPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Capacity is increased by " +
                    utils_1.formatDescription(values, function (val) { return val.toString(); }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var cell = trigger.before.cell;
                        var val = perk_1.getPerkValue(game, name, cell.playerId, values, defaultValue);
                        return [getReturnValue(cell.id, val)];
                    },
                },
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (pl) {
                            var val = perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                            var res2 = game.cells
                                .filter(function (cell) { return cell.playerId === pl.id; })
                                .map(function (cell) {
                                return getReturnValue(cell.id, val);
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
                    units: 50,
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
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
        perks: [{ name: name, data: { type: "number", val: [10, 20, 30] } }],
        moveHistory: [],
    },
};
