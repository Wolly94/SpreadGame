"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defenderDefendCellUtils = {
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
                .filter(function (p) {
                return p.type === "DefenderDefendCellEffect";
            })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.defenderDefendCellUtils.combine, exports.defenderDefendCellUtils.default);
        return combined;
    },
};
