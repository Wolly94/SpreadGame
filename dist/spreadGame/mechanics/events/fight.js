"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bubbleType = "BubbleFightProps";
var cellType = "CellFightProps";
exports.bubbleFightUtils = {
    combine: function (a, b) {
        return {
            type: bubbleType,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
        };
    },
    default: { type: bubbleType, combatAbilityModifier: 0 },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === bubbleType; })
            .reduce(function (prev, curr) {
            if (curr.type === bubbleType)
                return exports.bubbleFightUtils.combine(prev, curr);
            else
                return prev;
        }, exports.bubbleFightUtils.default);
    },
};
exports.cellFightUtils = {
    combine: function (a, b) {
        return {
            type: cellType,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
        };
    },
    default: {
        type: cellType,
        combatAbilityModifier: 0,
        membraneAbsorption: 0,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === cellType; })
            .reduce(function (prev, curr) {
            if (curr.type === cellType)
                return exports.cellFightUtils.combine(prev, curr);
            else
                return prev;
        }, exports.cellFightUtils.default);
    },
};
exports.isCellFightProps = function (props) {
    return props.membraneAbsorption !== undefined;
};
