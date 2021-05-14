"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// units ~ radius^2 where 50 ~ 50
exports.radiusToUnitsFixPoint = 50;
exports.radiusToUnits = function (radius) {
    if (radius <= 0)
        return 0;
    return Math.pow(radius, 2) / exports.radiusToUnitsFixPoint;
};
exports.unitsToRadius = function (units) {
    if (units <= 0)
        return 0;
    return Math.sqrt(units * exports.radiusToUnitsFixPoint);
};
// radius ~ units/second
// 50 ~ 1
var unitGrowthRadius = 50;
exports.radiusToGrowth = function (radius) {
    return radius / unitGrowthRadius;
};
