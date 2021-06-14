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
var spreadGameProps_1 = require("../../spreadGame/spreadGameProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseSpirit";
var values = [2, 4, 6];
var defaultValue = 0;
var simpleMap = {
    width: 500,
    height: 500,
    cells: [
        { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
        { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
        {
            id: 2,
            playerId: 1,
            position: [250, 400],
            radius: common_1.unitsToRadius(68),
            units: 68,
        },
    ],
    players: 2,
};
var replay = {
    gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
    lengthInMs: 5000,
    map: simpleMap,
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
        {
            timestamp: 1000,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [2], receiverId: 0 },
            },
        },
        {
            timestamp: 1500,
            data: {
                type: "sendunitsmove",
                data: { playerId: 1, senderIds: [2], receiverId: 0 },
            },
        },
    ],
};
var getCellDiff = function (cells, enemyPlayerId, ownPlayerId) {
    var attackerBubbles = cells.filter(function (b) { return b.playerId === enemyPlayerId; })
        .length;
    var defenderBubbles = cells.filter(function (b) { return b.playerId === ownPlayerId; })
        .length;
    return attackerBubbles - defenderBubbles;
};
exports.BaseSpirit = {
    name: name,
    values: values,
    description: "Attack and defense are increased by " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        " for every cell the enemy has more than you.",
    effects: [
        {
            type: "AttackerFightEffect",
            getValue: function (lvl, trigger, spreadGame) {
                if (trigger.defender !== null && trigger.defender.playerId !== null) {
                    var val = perk_1.getValue(values, lvl, defaultValue);
                    var x = getCellDiff(spreadGame.cells, trigger.defender.playerId, trigger.attacker.playerId);
                    return {
                        combatAbilityModifier: val * x,
                    };
                }
                else {
                    return spreadGameProps_1.combineAttackerFightProps.default;
                }
            },
        },
        {
            type: "DefenderFightEffect",
            getValue: function (lvl, defender, spreadGame, attacker) {
                if (defender.playerId !== null && attacker !== null) {
                    var val = perk_1.getValue(values, lvl, defaultValue);
                    var x = getCellDiff(spreadGame.cells, attacker.playerId, defender.playerId);
                    return __assign(__assign({}, spreadGameProps_1.combineDefenderFightProps.default), { combatAbilityModifier: val });
                }
                else if (defender.playerId !== null /* && attacker === null */) {
                    // TODO change if you want a visual effect in terms of combat ability modifier for the cells
                    return spreadGameProps_1.combineDefenderFightProps.default;
                }
                else {
                    return spreadGameProps_1.combineDefenderFightProps.default;
                }
            },
        },
    ],
    replay: replay,
};
