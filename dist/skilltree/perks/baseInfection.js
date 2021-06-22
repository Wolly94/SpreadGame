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
var growth_1 = require("../../spreadGame/mechanics/events/growth");
var infectCell_1 = require("../../spreadGame/mechanics/events/infectCell");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseInfection";
var defaultValue = 0;
var defaultValues = [1 / 100, 1 / 50, 1 / 33];
exports.BaseInfectionPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Base Infection",
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Cells you attacked are infected for " +
                    utils_1.formatDescription(values, function (val) { return "#attacker/" + (1 / val).toString(); }, ", ") +
                    " seconds, rendering them unable to grow.";
            },
            triggers: [
                {
                    type: "Infect",
                    getValue: function (trigger, game) {
                        var infRes = {
                            entity: trigger.entityToInfect,
                            perkName: name,
                            triggerType: "InfectEntity",
                            props: {
                                expirationInMs: game.timePassed + trigger.duration,
                                value: __assign(__assign({}, infectCell_1.infectCellUtils.default), { infectedBy: new Set([
                                        trigger.causerPlayerId,
                                    ]) }),
                            },
                        };
                        if (trigger.entityToInfect.type === "Cell") {
                            var growthProps = __assign(__assign({}, growth_1.growthUtils.default), { blocked: true });
                            var groRes = __assign(__assign({}, infRes), { props: __assign(__assign({}, infRes.props), { value: growthProps }) });
                            return [infRes, groRes];
                        }
                        else {
                            return [infRes];
                        }
                    },
                },
                {
                    type: "DefendCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.before.bubble.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        var timeToInfectInMs = val * trigger.before.bubble.units * 1000;
                        var infectEvent = {
                            type: "Infect",
                            causerPlayerId: playerId,
                            duration: timeToInfectInMs,
                            entityToInfect: {
                                type: "Cell",
                                id: trigger.after.cell.id,
                            },
                        };
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "DefendCell",
                                props: {
                                    expirationInMs: "Never",
                                    value: {
                                        type: "RaiseEvent",
                                        event: infectEvent,
                                    },
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
                    radius: common_1.unitsToRadius(90),
                    units: 140,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [300, 100],
                    radius: common_1.unitsToRadius(150),
                    units: 100,
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
