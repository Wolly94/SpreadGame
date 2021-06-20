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
var common_1 = require("../../spreadGame/common");
var fight_1 = require("../../spreadGame/mechanics/events/fight");
var visualizeBubbleProps_1 = require("../../spreadGame/mechanics/events/visualizeBubbleProps");
var visualizeCellProps_1 = require("../../spreadGame/mechanics/events/visualizeCellProps");
var utils_1 = require("../utils");
var perk_1 = require("./perk");
var name = "BaseSpirit";
var defaultValues = [2, 4, 6];
var defaultValue = 0;
var getCellDiff = function (cells, enemyPlayerId, ownPlayerId) {
    var attackerBubbles = cells.filter(function (b) { return b.playerId === enemyPlayerId; })
        .length;
    var defenderBubbles = cells.filter(function (b) { return b.playerId === ownPlayerId; })
        .length;
    return attackerBubbles - defenderBubbles;
};
var getProps = function (game, ownplayerId, incValue) {
    var maxCellDiff = game.players
        .filter(function (pl) { return pl.id !== ownplayerId; })
        .map(function (pl) {
        return getCellDiff(game.cells, pl.id, ownplayerId);
    })
        .reduce(function (prev, current) { return Math.max(prev, current); }, 0);
    var val = maxCellDiff * incValue;
    return [
        __assign(__assign({}, fight_1.bubbleFightUtils.default), { combatAbilityModifier: val }),
        __assign(__assign({}, fight_1.cellFightUtils.default), { combatAbilityModifier: val }),
    ];
};
var makeProps = function (props, entityId) {
    var c = {
        entity: {
            type: props.type === "BubbleFightProps" ? "Bubble" : "Cell",
            id: entityId,
        },
        perkName: name,
        triggerType: "BaseSpirit",
        props: {
            expirationInMs: "Never",
            value: props,
        },
    };
    var visualProps = props.type === "BubbleFightProps"
        ? __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { combatAbilityModifier: props.combatAbilityModifier }) : __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { combatAbilityModifier: props.combatAbilityModifier });
    var v = __assign(__assign({}, c), { props: __assign(__assign({}, c.props), { value: visualProps }) });
    return [c, v];
};
var getAllPlayerProps = function (game, playerId, bubbleProps, cellProps) {
    var res1 = game.cells
        .filter(function (cell) { return cell.playerId === playerId; })
        .flatMap(function (cell) {
        return makeProps(cellProps, cell.id);
    });
    var res2 = game.bubbles
        .filter(function (bubble) { return bubble.playerId === playerId; })
        .flatMap(function (bubble) {
        return makeProps(bubbleProps, bubble.id);
    });
    return __spreadArrays(res1, res2);
};
exports.BaseSpiritPerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: "Base Spirit",
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "Attack and defense are increased by " +
                    utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
                    " for every cell the enemy has more than you.";
            },
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (pl) {
                            var val = perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                            var _a = getProps(game, pl.id, val), bubbleProps = _a[0], cellProps = _a[1];
                            if (bubbleProps === undefined ||
                                cellProps === undefined)
                                return [];
                            return getAllPlayerProps(game, pl.id, bubbleProps, cellProps);
                        });
                        return res;
                    },
                },
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var playerId = trigger.after.bubble.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        var bubbleProps = getProps(game, playerId, val)[0];
                        if (bubbleProps === undefined)
                            return [];
                        return __spreadArrays(makeProps(bubbleProps, trigger.after.bubble.id));
                    },
                },
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        var res = game.players.flatMap(function (pl) {
                            var val = perk_1.getPerkValue(game, name, pl.id, values, defaultValue);
                            var _a = getProps(game, pl.id, val), bubbleProps = _a[0], cellProps = _a[1];
                            if (bubbleProps === undefined ||
                                cellProps === undefined)
                                return [];
                            return getAllPlayerProps(game, pl.id, bubbleProps, cellProps);
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
                    radius: common_1.unitsToRadius(60),
                    units: 120,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: common_1.unitsToRadius(60),
                    units: 60,
                },
                {
                    id: 2,
                    playerId: 1,
                    position: [400, 250],
                    radius: common_1.unitsToRadius(30),
                    units: 30,
                },
            ],
            players: 2,
        },
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
        perks: [{ name: name, data: { type: "number", val: [2, 4, 6] } }],
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
            {
                timestamp: 100,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 2 },
                },
            },
        ],
    },
};
