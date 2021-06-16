"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "SendUnits";
exports.sendUnitsUtils = {
    combine: function (a, b) {
        return {
            type: type,
            additionalUnits: a.additionalUnits + b.additionalUnits,
        };
    },
    default: { type: type, additionalUnits: 0 },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.sendUnitsUtils.combine(prev, curr);
            else
                return prev;
        }, exports.sendUnitsUtils.default);
    },
};
