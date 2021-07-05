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
var stolenPerk_1 = require("../../spreadGame/mechanics/events/stolenPerk");
var baseDefense_1 = require("./baseDefense");
var perk_1 = require("./perk");
var name = "Spy";
var defaultValue = 0;
var defaultValues = [100];
var perkToBeStolenInReplay = {
    name: baseDefense_1.BaseDefensePerk.name,
    data: { type: "number", val: [10, 20] },
};
exports.SpyPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "For every captured enemy cell you gain one of your enemies skills (starting with the cheapest).";
            },
            triggers: [
                // this trigger initializes e.g. BaseDefensePerk
                {
                    type: "StolenPerk",
                    getValue: function (trigger, game) {
                        // simulate StartGameEvent:
                        var startGameEvent = {
                            type: "StartGame",
                        };
                        var initProps = trigger.stolenPerk.perk.triggers
                            .filter(function (trigger) {
                            return trigger.type === "StartGame";
                        })
                            .flatMap(function (trigger) {
                            return trigger.getValue(startGameEvent, game);
                        });
                        return initProps;
                    },
                },
                {
                    type: "CapturedCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.afterPlayerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        if (val === defaultValue)
                            return [];
                        var probabilityToSteal = val / 100;
                        var rand = Math.random();
                        if (rand > probabilityToSteal)
                            return [];
                        var ownPerks = game.getSkilledPerks(playerId);
                        var availablePerks = game
                            .getSkilledPerks(trigger.beforePlayerId)
                            .filter(function (sp) {
                            return !ownPerks.some(function (ownSp) {
                                return ownSp.perk.name === sp.perk.name;
                            });
                        });
                        if (availablePerks.length === 0)
                            return [];
                        var stealPerk = __assign(__assign({}, availablePerks[0]), { level: 1 });
                        var raiseProps = {
                            type: "RaiseEvent",
                            event: {
                                type: "StolenPerk",
                                stolenPerk: stealPerk,
                            },
                        };
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "CapturedCell",
                                props: {
                                    expirationInMs: "Never",
                                    value: raiseProps,
                                },
                            },
                            {
                                entity: { type: "Player", id: playerId },
                                perkName: name,
                                triggerType: "StolenPerk" + game.timePassed.toString(),
                                props: {
                                    expirationInMs: "Never",
                                    value: __assign(__assign({}, stolenPerk_1.stolenPerksUtils.default), { skilledPerks: [stealPerk] }),
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
                    radius: 50,
                    units: 20,
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
                        receiverId: 1,
                    },
                },
            },
        ],
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
            perkToBeStolenInReplay,
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 1 }] },
            { id: 1, skills: [{ name: baseDefense_1.BaseDefensePerk.name, level: 3 }] },
        ],
    },
};
