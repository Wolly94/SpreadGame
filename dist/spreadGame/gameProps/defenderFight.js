"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefenderFightProps = function (props) {
    return props.membraneAbsorption !== undefined;
};
exports.defenderFightUtils = {
    combine: function (a, b) {
        return {
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
        };
    },
    default: { combatAbilityModifier: 0, membraneAbsorption: 0 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "DefenderFightEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.defenderFightUtils.combine, exports.defenderFightUtils.default);
        return {
            combatAbilityModifier: 1 + combined.combatAbilityModifier / 100,
            membraneAbsorption: combined.membraneAbsorption,
        };
    },
};
