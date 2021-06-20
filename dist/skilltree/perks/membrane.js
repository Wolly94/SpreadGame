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
var fight_1 = require("../../spreadGame/mechanics/events/fight");
var visualizeCellProps_1 = require("../../spreadGame/mechanics/events/visualizeCellProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Membrane";
var defaultValues = [10];
var defaultValue = 0;
var alreadyAbsorbed = function (event) {
    if (event.finished)
        return 0;
    else {
        return event.partialFights.reduce(function (prev, curr) { return prev + curr.data.attacker.unitsLost; }, 0);
    }
};
var attachPropTemplate = function (cellId, prop) {
    var res = {
        entity: { type: "Cell", id: cellId },
        perkName: name,
        triggerType: "ConquerCell",
        props: {
            expirationInMs: "Never",
            value: prop,
        },
    };
    return res;
};
exports.MembranePerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "The first " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    " of every attacking enemy bubble die to the membrane before doing damage.";
            },
            triggers: [
                {
                    type: "BeforeFightEvent",
                    getValue: function (trigger, game) {
                        var playerId = trigger.before.defender.val.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        if (trigger.before.defender.type !== "Cell" ||
                            val === defaultValue)
                            return [];
                        var existingFightEvent = game.eventHistory.find(function (ev) {
                            return ev.data.type === "FightEvent" &&
                                !ev.data.finished &&
                                ev.data.before.attacker.id ===
                                    trigger.before.attacker.id &&
                                ev.data.before.defender.type ===
                                    trigger.before.defender.type &&
                                ev.data.before.defender.val.id ===
                                    trigger.before.defender.val.id;
                        });
                        var absorbed = existingFightEvent === undefined
                            ? 0
                            : alreadyAbsorbed(existingFightEvent.data);
                        var props = __assign(__assign({}, fight_1.cellFightUtils.default), { membraneAbsorption: Math.max(val - absorbed, 0) });
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "BeforeFightEvent",
                                props: {
                                    expirationInMs: "Never",
                                    value: props,
                                },
                            },
                        ];
                    },
                },
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (pl) {
                            var val = perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                            if (val === defaultValue)
                                return [];
                            var props = __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { membraneAbsorption: val });
                            return game.cells.flatMap(function (c) {
                                if (c.playerId === pl.id)
                                    return [attachPropTemplate(c.id, props)];
                                else
                                    return [];
                            });
                        });
                        return res;
                    },
                },
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.after.cell.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        if (val === defaultValue)
                            return [];
                        var props = __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { membraneAbsorption: val });
                        return [
                            attachPropTemplate(trigger.after.cell.id, props),
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
                    radius: common_1.unitsToRadius(40),
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
            { id: 0, skills: [{ name: name, level: 1 }] },
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
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 1, senderIds: [2], receiverId: 0 },
                },
            },
        ],
    },
};
