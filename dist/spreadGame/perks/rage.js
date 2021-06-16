"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../skilltree/utils");
var perk_1 = require("./perk");
var name = "Rage";
var defaultValue = [0, 0];
exports.rageDefaultValues = [
    [2000, 20],
    [3000, 30],
];
exports.RagePerk = function (values) {
    if (values === void 0) { values = exports.rageDefaultValues; }
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
                type: "ConquerCell",
                getValue: function (trigger, game) {
                    var val = perk_1.getPerkValue(game, name, trigger.before.cell.playerId, values, defaultValue);
                    return {
                        entity: { type: "Bubble", id: "All" },
                        perkName: name,
                        props: {
                            expirationInMs: val[0] + game.timePassed,
                            value: {
                                type: "BubbleFightProps",
                                combatAbilityModifier: val[1],
                            },
                        },
                    };
                },
            },
        ],
        replay: {
            gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
            lengthInMs: 5000,
            map: { width: 500, height: 500, players: 2, cells: [] },
            moveHistory: [],
            players: [],
        },
    };
};
