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
    collidesWithBubble: function (bubble1, bubble2) {
        return !(commonMechanics_1.centerOverlap(bubble1, bubble2) < commonMechanics_1.calculationAccuracy);
    },
    collidesWithCell: function (bubble, cell) {
        return !(commonMechanics_1.centerOverlap(bubble, cell) < commonMechanics_1.calculationAccuracy);
    },
    collideBubble: function (bubble1, bubble2, f1, f2) {
        if (!basicMechanics.collidesWithBubble(bubble1, bubble2)) {
            return [__assign({}, bubble1), __assign({}, bubble2)];
        }
        // TODO modify 'this' accordingly
        // return
        if (bubble1.playerId === bubble2.playerId)
            return [__assign({}, bubble1), __assign({}, bubble2)];
        var result = commonMechanics_1.fight(bubble1.units, bubble2.units, f1, f2);
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
        var resBubble = __assign({}, bubble);
        var resCell = __assign({}, cell);
        if (!basicMechanics.collidesWithCell(bubble, cell)) {
            [resBubble, resCell];
        }
        if (resBubble.playerId === resCell.playerId) {
            commonMechanics_1.reinforceCell(resCell, resBubble.units);
        }
        else {
            var result = commonMechanics_1.fight(resBubble.units, resCell.units, f1, f2);
            commonMechanics_1.takeOverCell(resCell, result, resBubble.playerId);
        }
        return [null, resCell];
    },
    move: function (bubble, ms, moveProps) {
        var speed = exports.defaultSpeed * (1 + moveProps.additionalSpeedInPercent / 100);
        var newPosition = [
            bubble.position[0] + (speed * bubble.direction[0] * ms) / 1000.0,
            bubble.position[1] + (speed * bubble.direction[1] * ms) / 1000.0,
        ];
        var newUnits = bubble.units - (moveProps.unitLossPerSecond * ms) / 1000;
        return __assign(__assign({}, bubble), { position: newPosition, units: newUnits });
    },
    grow: function (cell, ms, growthProps) {
        if (cell.playerId === null)
            return __assign({}, cell);
        var saturatedUnitCount = common_1.radiusToUnits(cell.radius) + growthProps.additionalCapacity;
        var growthFactor = 1 + growthProps.additionalGrowthInPercent / 100;
        var posGrowthPerSecond = common_1.radiusToGrowth(cell.radius) * growthFactor;
        var negGrowthPerSecond = common_1.radiusToGrowth(cell.radius) / growthFactor;
        var toGrow = growthProps.blocked
            ? 0
            : (posGrowthPerSecond * ms) / 1000;
        var toReduce = (negGrowthPerSecond * ms) / 1000;
        var nextUnits = cell.units < saturatedUnitCount
            ? Math.min(cell.units + toGrow, saturatedUnitCount)
            : Math.max(cell.units - toReduce, saturatedUnitCount);
        return __assign(__assign({}, cell), { units: nextUnits });
    },
    sendBubble: function (sender, target, timePassed) {
        if (sender.playerId == null)
            return [__assign({}, sender), null];
        var direction = [
            target.position[0] - sender.position[0],
            target.position[1] - sender.position[1],
        ];
        var dist = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
        if (dist === 0)
            return [__assign({}, sender), null];
        var attacker = Math.floor(sender.units / 2);
        var resSender = __assign(__assign({}, sender), { units: sender.units - attacker });
        var lambda = sender.radius / dist;
        var normedDirection = [
            direction[0] / dist,
            direction[1] / dist,
        ];
        var position = [
            sender.position[0] + lambda * direction[0],
            sender.position[1] + lambda * direction[1],
        ];
        return [
            resSender,
            bubble_1.createBubble({
                id: bubble_1.getNewBubbleIndex(),
                direction: normedDirection,
                motherId: sender.id,
                playerId: sender.playerId,
                position: position,
                units: attacker,
                targetId: target.id,
                targetPos: target.position,
                creationTime: timePassed,
            }),
        ];
    },
};
exports.default = basicMechanics;
