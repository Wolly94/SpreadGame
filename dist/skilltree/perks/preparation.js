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
var name = "Preparation";
var defaultValues = [
    [1, 50],
    [2, 100],
];
var defaultValue = [0, 0];
var latestMoveTimeStamp = function (cell, eventHistory) {
    var lastAttackSent = eventHistory
        .filter(function (ev) {
        return ev.data.type === "SendBubbleEvent" &&
            ev.data.sender.id === cell.id;
    })
        .slice(-1)[0];
    var lastConquered = eventHistory
        .filter(function (ev) {
        return ev.data.type === "CapturedCell" &&
            ev.data.cellId === cell.id &&
            ev.data.beforePlayerId !== ev.data.afterPlayerId;
    } // this is unneccessary
    )
        .slice(-1)[0];
    var latestTimeStamp = Math.max(lastAttackSent === undefined ? 0 : lastAttackSent.timestamp, lastConquered === undefined ? 0 : lastConquered.timestamp);
    return latestTimeStamp;
};
var attachPropTemplate = function (cellId, prop) {
    var res = {
        entity: { type: "Cell", id: cellId },
        perkName: name,
        triggerType: "TimeStep",
        props: {
            expirationInMs: "Never",
            value: prop,
        },
    };
    return res;
};
exports.PreparationPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            values: values,
            defaultValue: defaultValue,
            description: function (lvl) {
                return "Raises combat abilities of your cells by " +
                    utils_1.formatDescription(values, function (val) { return val[0].toString() + "%"; }, "/") +
                    " for each second that cell did not send an attack, capped at " +
                    utils_1.formatDescription(values, function (val) { return val[1].toString() + "%"; }, "/") +
                    ".";
            },
            triggers: [
                {
                    type: "TimeStep",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (p) {
                            var val = perk_1.getPerkValue(game, name, p.id, values, defaultValue);
                            return game.cells.flatMap(function (cell) {
                                var idleInMs = game.timePassed -
                                    latestMoveTimeStamp(cell, game.eventHistory);
                                var combatModifier = Math.min((val[0] * idleInMs) / 1000, val[1]);
                                var prop1 = __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { combatAbilityModifier: combatModifier });
                                var prop2 = __assign(__assign({}, fight_1.cellFightUtils.default), { combatAbilityModifier: combatModifier });
                                return [
                                    attachPropTemplate(cell.id, prop1),
                                    attachPropTemplate(cell.id, prop2),
                                ];
                            });
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
                    position: [200, 200],
                    radius: common_1.unitsToRadius(204),
                    units: 204,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(100),
                    units: 100,
                },
            ],
            players: 2,
        },
        players: [
            { id: 0, skills: [] },
            { id: 1, skills: [{ name: name, level: 2 }] },
        ],
        perks: [
            {
                name: name,
                data: { type: "number_number", val: defaultValues },
            },
        ],
        moveHistory: [
            {
                timestamp: 2000,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
        ],
    },
};
