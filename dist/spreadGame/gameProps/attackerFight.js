"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attackerFightUtils = {
    combine: function (a, b) {
        return {
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
        };
    },
    default: { combatAbilityModifier: 0 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "AttackerFightEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.attackerFightUtils.combine, exports.attackerFightUtils.default);
        return { combatAbilityModifier: 1 + combined.combatAbilityModifier / 100 };
    },
};
