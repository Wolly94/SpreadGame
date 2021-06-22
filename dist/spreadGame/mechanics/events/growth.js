"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "Growth";
exports.growthUtils = {
    combine: function (a, b) {
        return {
            type: type,
            additionalCapacity: a.additionalCapacity + b.additionalCapacity,
            additionalGrowthInPercent: a.additionalGrowthInPercent + b.additionalGrowthInPercent,
            blocked: a.blocked || b.blocked,
        };
    },
    default: {
        type: type,
        additionalCapacity: 0,
        additionalGrowthInPercent: 0,
        blocked: false,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.growthUtils.combine(prev, curr);
            else
                return prev;
        }, exports.growthUtils.default);
    },
};
