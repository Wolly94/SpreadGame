"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var entites_1 = require("../entites");
var spreadGameProps_1 = require("../spreadGameProps");
exports.calculationAccuracy = 0.01;
exports.minOverlap = 2;
// > 0 means attacker won, <= 0 means defender won
exports.fight = function (att, def, am, bm) {
    if (spreadGameProps_1.isDefenderFightProps(bm)) {
        att -= bm.membraneAbsorption;
        if (att <= 0)
            return -def;
    }
    var unitDiff = att * am.combatAbilityModifier - def * bm.combatAbilityModifier;
    if (unitDiff <= 0)
        return unitDiff / bm.combatAbilityModifier;
    else
        return unitDiff / am.combatAbilityModifier;
};
// returns remaining fighters from both entities
exports.fightBubblePartial = function (att, def, am, bm, dist) {
    var maxUnits = common_1.radiusToUnits(dist);
    var upperBound = am * maxUnits;
    var lowerBound = bm * maxUnits;
    var unitDiff = att * am - def * bm;
    if (unitDiff >= upperBound)
        return [unitDiff / am, null];
    else if (unitDiff <= -lowerBound)
        return [null, -unitDiff / bm];
    else {
        var beta = (unitDiff + bm * maxUnits) / ((2 * dist * bm) / common_1.radiusToUnitsFixPoint);
        var deltaMod = am - bm;
        if (deltaMod === 0) {
            var ra = beta;
            return [common_1.radiusToUnits(ra), common_1.radiusToUnits(dist - ra)];
        }
        else {
            var alpha = deltaMod / (2 * dist * bm);
            var ra = -1 / (2 * alpha) + Math.sqrt(beta / alpha + 1 / (4 * Math.pow(alpha, 2)));
            return [common_1.radiusToUnits(ra), common_1.radiusToUnits(dist - ra)];
        }
    }
};
// newCellUnits is expected to be the result of 'fight' or 'fightCellPartial'
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
