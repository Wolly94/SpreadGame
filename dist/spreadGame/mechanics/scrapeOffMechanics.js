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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = require("../bubble");
var common_1 = require("../common");
var entites_1 = require("../entites");
var basicMechanics_1 = __importDefault(require("./basicMechanics"));
var commonMechanics_1 = require("./commonMechanics");
exports.cellFighters = function (bubbleUnits, bubbleSpace) {
    var fighters = bubbleUnits - common_1.radiusToUnits(bubbleSpace);
    return fighters;
};
var scrapeOffMechanics = {
    collideBubble: function (bubble1, bubble2, f1, f2) {
        if (commonMechanics_1.overlap(bubble1, bubble2) < commonMechanics_1.minOverlap + commonMechanics_1.calculationAccuracy)
            return [bubble1, bubble2];
        if (bubble1.playerId === bubble2.playerId)
            return [bubble1, bubble2];
        var dist = entites_1.distance(bubble1.position, bubble2.position);
        var _a = commonMechanics_1.fightBubblePartial(bubble1.units, bubble2.units, f1.combatAbilityModifier, f2.combatAbilityModifier, dist), u1 = _a[0], u2 = _a[1];
        var res1 = null;
        var res2 = null;
        if (u1 !== null) {
            res1 = bubble_1.setUnits(bubble1, u1);
        }
        if (u2 !== null) {
            res2 = bubble_1.setUnits(bubble2, u2);
        }
        return [res1, res2];
    },
    collideCell: function (bubble, cell, f1, f2) {
        var resCell = __assign({}, cell);
        if (commonMechanics_1.overlap(bubble, resCell) < commonMechanics_1.minOverlap + commonMechanics_1.calculationAccuracy)
            return [__assign({}, bubble), resCell];
        // if collides returns true, then dist <= bubble.radius
        var bubbleSpace = entites_1.distance(bubble.position, resCell.position) - resCell.radius;
        if (bubbleSpace <= commonMechanics_1.calculationAccuracy) {
            return basicMechanics_1.default.collideCell(bubble, resCell, f1, f2);
        }
        else {
            var fighters = exports.cellFighters(bubble.units, bubbleSpace);
            // fighters >= here
            if (bubble.playerId === resCell.playerId) {
                commonMechanics_1.reinforceCell(resCell, fighters);
            }
            else {
                var result = commonMechanics_1.fight(fighters, resCell.units, f1.combatAbilityModifier, f2.combatAbilityModifier);
                commonMechanics_1.takeOverCell(resCell, result, bubble.playerId);
            }
            var resBubble = bubble_1.createBubble(__assign(__assign({}, bubble), { units: bubble.units - fighters }));
            return [resBubble, resCell];
        }
    },
    move: basicMechanics_1.default.move,
    grow: basicMechanics_1.default.grow,
    sendBubble: basicMechanics_1.default.sendBubble,
};
exports.default = scrapeOffMechanics;
