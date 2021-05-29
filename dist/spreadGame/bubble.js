"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var bubbleIds = 0;
exports.getNewBubbleIndex = function () {
    bubbleIds += 1;
    return bubbleIds;
};
exports.setUnits = function (bubble, units) {
    return __assign(__assign({}, bubble), { units: units, radius: common_1.unitsToRadius(units) });
};
exports.createBubble = function (bc) {
    var b = __assign(__assign({}, bc), { radius: 0 });
    return exports.setUnits(b, b.units);
};
