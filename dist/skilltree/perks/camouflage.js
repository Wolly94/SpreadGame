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
var visualizeBubbleProps_1 = require("../../spreadGame/mechanics/events/visualizeBubbleProps");
var visualizeCellProps_1 = require("../../spreadGame/mechanics/events/visualizeCellProps");
var perk_1 = require("./perk");
var name = "Camouflage";
var defaultValue = 0;
var defaultValues = [1];
var getResultVisualProps = function (entityId, props) {
    if (props.type === "VisualizeBubbleProps") {
        var result = {
            entity: {
                type: "Bubble",
                id: entityId,
            },
            perkName: name,
            triggerType: name,
            props: {
                expirationInMs: "Never",
                value: props,
            },
        };
        return result;
    }
    else {
        var result = {
            entity: {
                type: "Cell",
                id: entityId,
            },
            perkName: name,
            triggerType: name,
            props: {
                expirationInMs: "Never",
                value: props,
            },
        };
        return result;
    }
};
var getVisualProps = function (playerId, players) {
    var cellHideProps = new Map();
    var bubbleHideProps = new Map();
    players
        .filter(function (pl) { return pl.id !== playerId; })
        .forEach(function (pl) {
        cellHideProps.set(pl.id, __assign(__assign({}, visualizeCellProps_1.cellHideUtils.default), { showUnits: false }));
        bubbleHideProps.set(pl.id, __assign(__assign({}, visualizeBubbleProps_1.bubbleHideUtils.default), { invisible: true }));
    });
    var cellProps = __assign(__assign({}, visualizeCellProps_1.visualizeCellUtils.default), { hideProps: cellHideProps });
    var bubbleProps = __assign(__assign({}, visualizeBubbleProps_1.visualizeBubbleUtils.default), { hideProps: bubbleHideProps });
    return [cellProps, bubbleProps];
};
exports.CamouflagePerk = {
    name: name,
    createFromValues: function (values) {
        if (values === void 0) { values = defaultValues; }
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: function (lvl) {
                return "The enemy can only see the cell capacity of your cells, but not population or bubble-size.";
            },
            triggers: [
                {
                    type: "CreateBubble",
                    getValue: function (trigger, game) {
                        var playerId = trigger.after.bubble.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        if (val === defaultValue)
                            return [];
                        var _a = getVisualProps(playerId, game.players), props = _a[1];
                        return [
                            getResultVisualProps(trigger.after.bubble.id, props),
                        ];
                    },
                },
                {
                    type: "ConquerCell",
                    getValue: function (trigger, game) {
                        var playerId = trigger.after.cell.playerId;
                        var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                        if (val === defaultValue)
                            return [];
                        var props = getVisualProps(playerId, game.players)[0];
                        return [
                            getResultVisualProps(trigger.after.cell.id, props),
                        ];
                    },
                },
                {
                    type: "StartGame",
                    getValue: function (trigger, game) {
                        return game.players.flatMap(function (pl) {
                            var playerId = pl.id;
                            var val = perk_1.getPerkValue(game, name, playerId, values, defaultValue);
                            if (val === defaultValue)
                                return [];
                            var props = getVisualProps(playerId, game.players)[0];
                            return game.cells.flatMap(function (cell) {
                                return [getResultVisualProps(cell.id, props)];
                            });
                        });
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
                    units: 50,
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
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
        ],
        perks: [
            {
                name: name,
                data: {
                    type: "number",
                    val: defaultValues,
                },
            },
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 1 }] },
            { id: 1, skills: [] },
        ],
    },
};
