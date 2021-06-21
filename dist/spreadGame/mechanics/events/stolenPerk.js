"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "StolenPerk";
exports.stolenPerksUtils = {
    combine: function (a, b) {
        return {
            type: type,
            skilledPerks: a.skilledPerks.concat(b.skilledPerks),
        };
    },
    default: { type: type, skilledPerks: [] },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.stolenPerksUtils.combine(prev, curr);
            else
                return prev;
        }, exports.stolenPerksUtils.default);
    },
};
