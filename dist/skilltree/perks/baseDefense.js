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
var fight_1 = require("../../spreadGame/mechanics/events/fight");
var visualizeCellProps_1 = require("../../spreadGame/mechanics/events/visualizeCellProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseDefense";
var defaultValue = 0;
var defaultValues = [10, 20, 30];
var attachProps = function (val, cellId) {
    var resTempl = {
        entity: {
            type: "Cell",
            id: cellId,
        },
        perkName: name,
        triggerType: "ConquerCell",
        props: {
            expirationInMs: "Never",
            value: __assign(__assign({}, fight_1.cellFightUtils.default), { combatAbilityModifier: val }),
        },
    };
    var visProps = __assign(__assign({}, resTempl), { props: __assign(__assign({}, resTempl.props), { value: __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { combatAbilityModifier: val }) }) });
    return [resTempl, visProps];
};
exports.BaseDefensePerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Raises combat abilities of your cells by " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.after.cell.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        return attachProps(val, trigger.after.cell.id);
                    },
                },
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (p) {
                            var val = perk_1.getPerkValue(game, name, p.id, values, defaultValue);
                            return game.cells
                                .filter(function (c) { return c.playerId === p.id; })
                                .flatMap(function (c) { return attachProps(val, c.id); });
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
                data: { type: "number", val: [10, 20, 30] },
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
            {
                timestamp: 1000,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
        ],
    },
};
