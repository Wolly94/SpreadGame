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
var bubble_1 = require("../bubble");
var common_1 = require("../common");
var commonMechanics_1 = require("./commonMechanics");
exports.defaultSpeed = 90;
var basicMechanics = {
    collideBubble: function (bubble1, bubble2, f1, f2) {
        if (commonMechanics_1.centerOverlap(bubble1, bubble2) < commonMechanics_1.calculationAccuracy)
            return [bubble1, bubble2];
        // TODO modify 'this' accordingly
        // return
        if (bubble1.playerId === bubble2.playerId)
            return [bubble1, bubble2];
        var result = commonMechanics_1.fight(bubble1.units, bubble2.units, f1.attackModifier, f2.attackModifier);
        if (Math.abs(result) < commonMechanics_1.calculationAccuracy) {
            return [null, null];
        }
        else if (result > 0) {
            return [bubble_1.setUnits(bubble1, result), null];
        }
        else {
            return [null, bubble_1.setUnits(bubble2, -result)];
        }
    },
    collideCell: function (bubble, cell, f1, f2) {
        if (commonMechanics_1.centerOverlap(bubble, cell) < commonMechanics_1.calculationAccuracy)
            return bubble;
        if (bubble.playerId === cell.playerId) {
            commonMechanics_1.reinforceCell(cell, bubble.units);
        }
        else {
            var result = commonMechanics_1.fight(bubble.units, cell.units, f1.attackModifier, f2.attackModifier);
            commonMechanics_1.takeOverCell(cell, result, bubble.playerId);
        }
        return null;
    },
    move: function (bubble, ms) {
        bubble.position[0] += (exports.defaultSpeed * bubble.direction[0] * ms) / 1000.0;
        bubble.position[1] += (exports.defaultSpeed * bubble.direction[1] * ms) / 1000.0;
        return bubble;
    },
    grow: function (cell, ms) {
        if (cell.playerId === null)
            return cell;
        var saturatedUnitCount = common_1.radiusToUnits(cell.radius);
        var sign = cell.units > saturatedUnitCount ? -1 : 1;
        var growthPerSecond = common_1.radiusToGrowth(cell.radius);
        var nextUnits = cell.units + (sign * (growthPerSecond * ms)) / 1000;
        var newUnits = (nextUnits > saturatedUnitCount && sign === 1) ||
            (nextUnits < saturatedUnitCount && sign === -1)
            ? saturatedUnitCount
            : nextUnits;
        return __assign(__assign({}, cell), { units: newUnits });
    },
    sendBubble: function (sender, target) {
        if (sender.playerId == null)
            return null;
        var attacker = Math.floor(sender.units / 2);
        sender.units -= attacker;
        var direction = [
            target.position[0] - sender.position[0],
            target.position[1] - sender.position[1],
        ];
        var dist = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
        if (dist === 0)
            return null;
        var lambda = sender.radius / dist;
        var normedDirection = [
            direction[0] / dist,
            direction[1] / dist,
        ];
        var position = [
            sender.position[0] + lambda * direction[0],
            sender.position[1] + lambda * direction[1],
        ];
        return bubble_1.createBubble({
            id: bubble_1.getNewBubbleIndex(),
            direction: normedDirection,
            motherId: sender.id,
            playerId: sender.playerId,
            position: position,
            units: attacker,
            targetId: target.id,
            targetPos: target.position,
        });
    },
};
exports.default = basicMechanics;
