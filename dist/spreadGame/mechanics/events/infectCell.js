"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var type = "InfectCell";
exports.infectCellUtils = {
    combine: function (a, b) {
        return {
            type: type,
            infectedBy: new Set(__spreadArrays(Array.from(a.infectedBy), Array.from(b.infectedBy))),
        };
    },
    default: { type: type, infectedBy: new Set() },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.infectCellUtils.combine(prev, curr);
            else
                return prev;
        }, exports.infectCellUtils.default);
    },
};
