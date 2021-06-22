"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "Move";
exports.moveUtils = {
    combine: function (a, b) {
        return {
            type: type,
            additionalSpeedInPercent: a.additionalSpeedInPercent + b.additionalSpeedInPercent,
            unitLossPerSecond: Math.max(a.unitLossPerSecond, b.unitLossPerSecond),
        };
    },
    default: {
        type: type,
        additionalSpeedInPercent: 0,
        unitLossPerSecond: 0,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.moveUtils.combine(prev, curr);
            else
                return prev;
        }, exports.moveUtils.default);
    },
};
