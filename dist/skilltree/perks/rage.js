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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var visualizeBubbleProps_1 = require("../../spreadGame/mechanics/events/visualizeBubbleProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Rage";
var defaultValue = [0, 0];
var defaultValues = [
    [2000, 20],
    [3000, 30],
];
exports.RagePerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Rage",
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "Whenever a friendly cell is lost, combat abilities of all currently existing bubbles are increased by " +
                    utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
                    " for " +
                    utils_1.formatDescription(values, function (val) { return (val[0] / 1000).toString(); }, "/") +
                    " seconds.";
            },
            triggers: [
                {
                    type: "CapturedCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.beforePlayerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        var resPropsTemplate = {
                            entity: null,
                            perkName: name,
                            triggerType: "CapturedCell",
                            props: {
                                expirationInMs: val[0] + game.timePassed,
                                value: {
                                    type: "BubbleFightProps",
                                    combatAbilityModifier: val[1],
                                },
                            },
                        };
                        var playerProps = __assign(__assign({}, resPropsTemplate), { entity: {
                                type: "Player",
                                id: playerId,
                            } });
                        var bubbleProps = game.bubbles
                            .filter(function (b) { return b.playerId === playerId; })
                            .flatMap(function (b) {
                            return [
                                __assign(__assign({}, resPropsTemplate), { entity: {
                                        type: "Bubble",
                                        id: b.id,
                                    } }),
                                __assign(__assign({}, resPropsTemplate), { entity: {
                                        type: "Bubble",
                                        id: b.id,
                                    }, props: __assign(__assign({}, resPropsTemplate.props), { value: __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { combatAbilityModifier: val[1] }) }) }),
                            ];
                        });
                        return __spreadArrays([playerProps], bubbleProps);
                    },
                },
                {
                    type: "SendUnits",
                    getValue: function (trigger, game) {
                        var playerId = trigger.sender.playerId;
                        // find the above attached value:
                        var prop = game.attachedProps.find(function (ap) {
                            var _a;
                            return ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Player" &&
                                ap.entity.id === playerId &&
                                ap.perkName === name &&
                                ap.props.value.type === "BubbleFightProps" &&
                                ap.triggerType === "CapturedCell";
                        } // this is unnecessary
                        );
                        return prop === undefined
                            ? []
                            : [
                                prop,
                                __assign(__assign({}, prop), { props: __assign(__assign({}, prop.props), { value: __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { combatAbilityModifier: prop.props.value
                                                .combatAbilityModifier }) }) }),
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
                    playerId: 0,
                    position: [400, 100],
                    radius: 50,
                    units: 10,
                },
                {
                    id: 2,
                    playerId: 1,
                    position: [250, 400],
                    radius: 50,
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
                        playerId: 1,
                        senderIds: [2],
                        receiverId: 1,
                    },
                },
            },
            {
                timestamp: 2000,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 0,
                        senderIds: [0],
                        receiverId: 2,
                    },
                },
            },
        ],
        perks: [
            {
                name: name,
                data: { type: "number_number", val: defaultValues },
            },
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
    },
};
