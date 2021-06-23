"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "VisualizeBubbleProps";
exports.visualizeBubbleUtils = {
    combine: function (a, b) {
        return {
            type: type,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            infected: a.infected || b.infected,
        };
    },
    default: {
        type: type,
        combatAbilityModifier: 0,
        infected: false,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.visualizeBubbleUtils.combine(prev, curr);
            else
                return prev;
        }, exports.visualizeBubbleUtils.default);
    },
};
