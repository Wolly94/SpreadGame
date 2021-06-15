"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defenderStartUtils = {
    combine: function (a, b) {
        return {
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { additionalUnits: 0 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "DefenderStartEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.defenderStartUtils.combine, exports.defenderStartUtils.default);
        return combined;
    },
};
