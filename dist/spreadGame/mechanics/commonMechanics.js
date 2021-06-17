"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var entites_1 = require("../entites");
var fight_1 = require("./events/fight");
exports.calculationAccuracy = 0.01;
exports.minOverlap = 2;
// > 0 means attacker won, <= 0 means defender won
exports.fight = function (att, def, am, bm) {
    var factorA = 1 + am.combatAbilityModifier / 100;
    var factorB = 1 + bm.combatAbilityModifier / 100;
    if (fight_1.isCellFightProps(bm)) {
        att -= bm.membraneAbsorption;
        if (att <= 0)
            return -def;
    }
    var unitDiff = att * factorA - def * factorB;
    if (unitDiff <= 0)
        return unitDiff / factorB;
    else
        return unitDiff / factorA;
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
        var beta = (unitDiff + bm * maxUnits) /
            ((2 * dist * bm) / common_1.radiusToUnitsFixPoint);
        var deltaMod = am - bm;
        if (deltaMod === 0) {
            var ra = beta;
            return [common_1.radiusToUnits(ra), common_1.radiusToUnits(dist - ra)];
        }
        else {
            var alpha = deltaMod / (2 * dist * bm);
            var ra = -1 / (2 * alpha) +
                Math.sqrt(beta / alpha + 1 / (4 * Math.pow(alpha, 2)));
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
exports.isBubble = function (val) {
    return val.direction !== undefined;
};
exports.approaching = function (b, e) {
    var direction = b.direction;
    if (exports.isBubble(e)) {
        direction = [
            direction[0] - e.direction[0],
            direction[1] - e.direction[1],
        ];
    }
    var relPosition = [
        b.position[0] - e.position[0],
        b.position[1] - e.position[1],
    ];
    var res = direction[0] * relPosition[0] + direction[1] * relPosition[1];
    return res < 0;
};
