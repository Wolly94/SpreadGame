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
var utils_1 = require("../../skilltree/utils");
var visualizeBubbleProps_1 = require("../../spreadGame/mechanics/events/visualizeBubbleProps");
var perk_1 = require("./perk");
var name = "BaseAttack";
var defaultValue = 0;
var defaultValues = [10, 20, 30];
exports.BaseAttackPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Base Attack",
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "Raises combat abilities of your bubbles by " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.sendUnitsEvent.sender.playerId, values, defaultValue);
                        var bubbleProps = {
                            entity: {
                                type: "Bubble",
                                id: trigger.after.bubble.id,
                            },
                            perkName: name,
                            triggerType: "CreateBubble",
                            props: {
                                expirationInMs: "Never",
                                value: {
                                    type: "BubbleFightProps",
                                    combatAbilityModifier: val,
                                },
                            },
                        };
                        return [bubbleProps];
                    },
                },
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var val = perk_1.getPerkValue(game, name, trigger.sendUnitsEvent.sender.playerId, values, defaultValue);
                        var visProps = {
                            entity: {
                                type: "Bubble",
                                id: trigger.after.bubble.id,
                            },
                            perkName: name,
                            triggerType: "CreateBubble",
                            props: {
                                expirationInMs: "Never",
                                value: __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { combatAbilityModifier: val }),
                            },
                        };
                        return [visProps];
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
                    units: 50,
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
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 1,
                        senderIds: [1],
                        receiverId: 0,
                    },
                },
            },
        ],
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
    },
};
