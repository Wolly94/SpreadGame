"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "ConquerCell";
exports.conquerCellUtils = {
    combine: function (a, b) {
        return {
            type: type,
            additionalUnits: a.additionalUnits + b.additionalUnits,
            unitsInPercentToRemain: a.unitsInPercentToRemain * b.unitsInPercentToRemain,
        };
    },
    default: { type: type, additionalUnits: 0, unitsInPercentToRemain: 1 },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.conquerCellUtils.combine(prev, curr);
            else
                return prev;
        }, exports.conquerCellUtils.default);
    },
};
