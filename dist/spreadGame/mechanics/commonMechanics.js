"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entites_1 = require("../entites");
exports.calculationAccuracy = 0.01;
exports.minOverlap = 2;
exports.fight = function (att, def, fightModifier) {
    return att - def;
};
exports.takeOverCell = function (cell, newCellUnits, enemyPlayerId) {
    if (newCellUnits > exports.calculationAccuracy) {
        cell.units = newCellUnits;
        cell.playerId = enemyPlayerId;
    }
    else {
        cell.units = -newCellUnits;
    }
};
exports.reinforceCell = function (cell, units) {
    cell.units += units;
};
exports.overlap = function (b, e) {
    return b.radius + e.radius - entites_1.distance(b.position, e.position);
};
exports.centerOverlap = function (b, e) {
    return Math.max(b.radius, e.radius) - entites_1.distance(b.position, e.position);
};
// <= 0 if entities at least touch each other
exports.entityDistance = function (b, e) {
    return Math.max(-exports.overlap(b, e), 0);
};
// <= 0 if at least the center of one entity is contained in the other entity
exports.centerOverlapDistance = function (b, e) {
    return Math.max(-exports.centerOverlap(b, e), 0);
};
