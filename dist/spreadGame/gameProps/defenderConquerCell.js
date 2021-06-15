"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defenderConquerCellUtils = {
    combine: function (a, b) {
        return {
            unitsInPercentToRemain: a.unitsInPercentToRemain * b.unitsInPercentToRemain,
        };
    },
    default: { unitsInPercentToRemain: 1 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) {
                return p.type === "DefenderConquerCellEffect";
            })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.defenderConquerCellUtils.combine, exports.defenderConquerCellUtils.default);
        return combined;
    },
};
