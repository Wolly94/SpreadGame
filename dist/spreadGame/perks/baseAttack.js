"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../skilltree/utils");
var perk_1 = require("./perk");
var name = "BaseAttack";
var defaultValue = 0;
var baseAttackDefaultValues = [10, 20, 30];
exports.BaseAttackPerk = function (values) {
    if (values === void 0) { values = baseAttackDefaultValues; }
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
                    return {
                        entity: { type: "Bubble", id: trigger.after.bubble.id },
                        perkName: name,
                        props: {
                            expirationInMs: "Never",
                            value: {
                                type: "BubbleFightProps",
                                combatAbilityModifier: val,
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
