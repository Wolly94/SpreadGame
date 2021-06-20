"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "VisualizeCellProps";
exports.visualizeCellUtils = {
    combine: function (a, b) {
        return {
            type: type,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            rageValue: a.rageValue + b.rageValue,
            membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
        };
    },
    default: {
        type: type,
        combatAbilityModifier: 0,
        rageValue: 0,
        membraneAbsorption: 0,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.visualizeCellUtils.combine(prev, curr);
            else
                return prev;
        }, exports.visualizeCellUtils.default);
    },
};
