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
var visualizeBubbleProps_1 = require("../../spreadGame/mechanics/events/visualizeBubbleProps");
var visualizeCellProps_1 = require("../../spreadGame/mechanics/events/visualizeCellProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "Berserk";
var defaultValue = [0, 0];
var defaultValues = [
    [2000, 5],
    [2000, 10],
];
var currentAttacksSent = function (toleratedTimeSpan, attacker, eventHistory) {
    var attacksSentBeforeCreation = eventHistory.filter(function (ev) {
        return ev.data.type === "SendBubbleEvent" &&
            ev.data.sender.id === attacker.motherId &&
            ev.data.sender.playerId === attacker.playerId &&
            ev.timestamp >= attacker.creationTime - toleratedTimeSpan &&
            ev.timestamp < attacker.creationTime;
    });
    return attacksSentBeforeCreation.length;
};
exports.BerserkPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "For every consecutive (within " +
                    utils_1.formatDescription(values, function (val) { return (val[0] / 1000).toString(); }, "/") +
                    " seconds after the last) attack a cell orders it's attack increases by " +
                    utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var playerId = trigger.sendUnitsEvent.sender.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        var factor = currentAttacksSent(val[0], trigger.after.bubble, game.eventHistory);
                        var combatModifier = val[1] * factor;
                        var bubbleProps = {
                            entity: {
                                type: "Bubble",
                                id: trigger.after.bubble.id,
                            },
                            perkName: name,
                            triggerType: "SendUnits",
                            props: {
                                expirationInMs: "Never",
                                value: {
                                    type: "BubbleFightProps",
                                    combatAbilityModifier: combatModifier,
                                },
                            },
                        };
                        var visualBubbleProps = __assign(__assign({}, bubbleProps), { props: __assign(__assign({}, bubbleProps.props), { value: __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { combatAbilityModifier: combatModifier }) }) });
                        var visualCellProps = __assign(__assign({}, bubbleProps), { triggerType: "SendUnits" + game.timePassed.toString(), entity: {
                                type: "Cell",
                                id: trigger.sendUnitsEvent.sender.id,
                            }, props: __assign(__assign({}, bubbleProps.props), { expirationInMs: game.timePassed + val[0], value: __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { rageValue: val[1] }) }) });
                        return [
                            bubbleProps,
                            visualBubbleProps,
                            visualCellProps,
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
                    units: 80,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(40),
                    units: 40,
                },
                {
                    id: 2,
                    playerId: 1,
                    position: [250, 400],
                    radius: common_1.unitsToRadius(20),
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
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
            {
                timestamp: 500,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 2 },
                },
            },
            {
                timestamp: 1000,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
            {
                timestamp: 3500,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
        ],
        perks: [
            {
                name: name,
                data: {
                    type: "number_number",
                    val: [
                        [2000, 5],
                        [2000, 10],
                    ],
                },
            },
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
    },
};
