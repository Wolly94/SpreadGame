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
var infectBubble_1 = require("../../spreadGame/mechanics/events/infectBubble");
var infectCell_1 = require("../../spreadGame/mechanics/events/infectCell");
var baseInfection_1 = require("./baseInfection");
var perk_1 = require("./perk");
var name = "Contaigous";
var defaultValue = 0;
var defaultValues = [1];
var getRemainingInfectionTime = function (game, cellId, playerId) {
    var infectedUntil = game.attachedProps
        .filter(function (ap) {
        var _a;
        return (ap.props.value.type === "InfectCell" &&
            ap.props.value.infectedBy.has(playerId) &&
            ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Cell" &&
            ap.entity.id === cellId);
    })
        .map(function (prop) { return prop.props.expirationInMs; })
        .reduce(function (prev, curr) {
        if (prev === "Never" || curr === "Never")
            return "Never";
        else
            return Math.max(prev, curr);
    }, 0);
    if (infectedUntil === "Never") {
        throw new Error("Invalid infection duration for cell.");
    }
    return Math.max(infectedUntil - game.timePassed, 0);
};
exports.ContaiguousPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Enemy cells infect each other when transferring.";
            },
            triggers: [
                {
                    type: "ReinforcedCell",
                    getValue: function (trigger, game) {
                        // check wether this was the target
                        //if (trigger.after.bubble !== null) return [];
                        var infections = infectBubble_1.infectBubbleUtils.collect(game.fromAttachedProps({
                            type: "Bubble",
                            id: trigger.bubbleId,
                        }));
                        var res = Array.from(infections.infectedBy.entries()).map(function (entry) {
                            var props = {
                                type: "RaiseEvent",
                                event: {
                                    type: "Infect",
                                    entityToInfect: {
                                        type: "Cell",
                                        id: trigger.cellId,
                                    },
                                    causerPlayerId: entry[0],
                                    duration: entry[1].infectionTimeLeftInMs,
                                },
                            };
                            return {
                                entity: null,
                                perkName: name,
                                triggerType: "ReinforcedCell",
                                props: {
                                    expirationInMs: "Never",
                                    value: props,
                                },
                            };
                        });
                        return res;
                    },
                },
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var cellId = trigger.sendUnitsEvent.sender.id;
                        var infections = infectCell_1.infectCellUtils.collect(game.fromAttachedProps({
                            type: "Cell",
                            id: cellId,
                        }));
                        var bubbleInf = new Map();
                        Array.from(infections.infectedBy).forEach(function (infectedByPlayerId) {
                            var val = perk_1.getPerkValue(game, name, infectedByPlayerId, values, defaultValue);
                            if (val === defaultValue)
                                return;
                            var remInfectionTime = getRemainingInfectionTime(game, cellId, infectedByPlayerId);
                            bubbleInf.set(infectedByPlayerId, {
                                infectionTimeLeftInMs: remInfectionTime,
                            });
                        });
                        var props = __assign(__assign({}, infectBubble_1.infectBubbleUtils.default), { infectedBy: bubbleInf });
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
                    units: 140,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [300, 100],
                    radius: 50,
                    units: 100,
                },
                {
                    id: 2,
                    playerId: 1,
                    position: [300, 300],
                    radius: 50,
                    units: 10,
                },
            ],
            players: 2,
        },
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
            {
                name: baseInfection_1.BaseInfectionPerk.name,
                data: baseInfection_1.BaseInfectionPerk.replay.perks[0].data,
            },
        ],
        players: [
            {
                id: 0,
                skills: [
                    { name: baseInfection_1.BaseInfectionPerk.name, level: 3 },
                    { name: name, level: 3 },
                ],
            },
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
            {
                timestamp: 1500,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 1, senderIds: [1], receiverId: 2 },
                },
            },
        ],
    },
};
