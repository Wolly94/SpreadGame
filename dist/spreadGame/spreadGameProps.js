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
exports.combineDefenderFightProps = {
    combine: function (a, b) {
        return {
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
        };
    },
    default: { combatAbilityModifier: 0 },
};
exports.combineConquerCellProps = {
    combine: function (a, b) {
        return {
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { additionalUnits: 0 },
};
exports.combineDefendCellProps = {
    combine: function (a, b) {
        return {
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { additionalUnits: 0 },
};
