"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attackerDefendCellUtils = {
    combine: function (a, b) {
        return {
            blockGrowthInMs: a.blockGrowthInMs + b.blockGrowthInMs,
        };
    },
    default: { blockGrowthInMs: 0 },
    collect: function (skilledPerks, trigger, spreadGame) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) {
                return p.type === "AttackerDefendCellEffect";
            })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, trigger, spreadGame);
            });
        })
            .reduce(exports.attackerDefendCellUtils.combine, exports.attackerDefendCellUtils.default);
        return combined;
    },
};
