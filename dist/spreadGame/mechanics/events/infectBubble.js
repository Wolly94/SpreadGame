"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "InfectBubble";
var comb = function (a, b) {
    return {
        infectionTimeLeftInMs: Math.max(a.infectionTimeLeftInMs, b.infectionTimeLeftInMs),
    };
};
exports.infectBubbleUtils = {
    combine: function (a, b) {
        var combined = new Map();
        Array.from(a.infectedBy.entries()).forEach(function (entry) {
            var exVal = combined.get(entry[0]);
            if (exVal === undefined)
                combined.set(entry[0], entry[1]);
            else
                combined.set(entry[0], comb(exVal, entry[1]));
        });
        Array.from(b.infectedBy.entries()).forEach(function (entry) {
            var exVal = combined.get(entry[0]);
            if (exVal === undefined)
                combined.set(entry[0], entry[1]);
            else
                combined.set(entry[0], comb(exVal, entry[1]));
        });
        return {
            type: type,
            infectedBy: combined,
        };
    },
    default: { type: type, infectedBy: new Map() },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.infectBubbleUtils.combine(prev, curr);
            else
                return prev;
        }, exports.infectBubbleUtils.default);
    },
};
