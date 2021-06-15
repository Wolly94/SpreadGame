"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthUtils = {
    combine: function (a, b) {
        return {
            additionalGrowthInPercent: a.additionalGrowthInPercent + b.additionalGrowthInPercent,
            additionalCapacity: a.additionalCapacity + b.additionalCapacity,
        };
    },
    default: { additionalGrowthInPercent: 0, additionalCapacity: 0 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "DefenderGrowthEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.growthUtils.combine, exports.growthUtils.default);
        return combined;
    },
};
