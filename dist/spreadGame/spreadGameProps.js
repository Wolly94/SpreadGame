"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAttackerFightProps = {
    combine: function (a, b) {
        return {
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
        };
    },
    default: { combatAbilityModifier: 0 },
};
exports.isDefenderFightProps = function (fightProps) {
    return fightProps.membraneAbsorption !== undefined;
};
exports.combineDefenderFightProps = {
    combine: function (a, b) {
        return {
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
        };
    },
    default: { combatAbilityModifier: 0, membraneAbsorption: 0 },
};
exports.combineAttackerConquerCellProps = {
    combine: function (a, b) {
        return {
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { additionalUnits: 0 },
};
exports.combineDefenderConquerCellProps = {
    combine: function (a, b) {
        return {
            unitsInPercentToRemain: a.unitsInPercentToRemain * b.unitsInPercentToRemain,
        };
    },
    default: { unitsInPercentToRemain: 1 },
};
exports.combineDefendCellProps = {
    combine: function (a, b) {
        return {
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { additionalUnits: 0 },
};
