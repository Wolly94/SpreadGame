"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonMechanics_1 = require("./commonMechanics");
var basicMechanics = {
    collideBubble: function (bubble1, bubble2, fightModifier) {
        if (commonMechanics_1.centerOverlap(bubble1, bubble2) < commonMechanics_1.calculationAccuracy)
            return [bubble1, bubble2];
        // TODO modify 'this' accordingly
        // return
        if (bubble1.playerId === bubble2.playerId)
            return [bubble1, bubble2];
        var result = commonMechanics_1.fight(bubble1.units, bubble2.units, fightModifier);
        if (Math.abs(result) < commonMechanics_1.calculationAccuracy) {
            return [null, null];
        }
        else if (result > 0) {
            bubble1.units = result;
            bubble1.updateRadius();
            return [bubble1, null];
        }
        else {
            bubble2.units = -result;
            bubble2.updateRadius();
            return [null, bubble2];
        }
    },
    collideCell: function (bubble, cell, fightModifier) {
        if (commonMechanics_1.centerOverlap(bubble, cell) < commonMechanics_1.calculationAccuracy)
            return bubble;
        if (bubble.playerId === cell.playerId) {
            commonMechanics_1.reinforceCell(cell, bubble.units);
        }
        else {
            var result = commonMechanics_1.fight(bubble.units, cell.units, fightModifier);
            commonMechanics_1.takeOverCell(cell, result, bubble.playerId);
        }
        return null;
    },
    move: function (bubble, ms) {
        bubble.position[0] += (bubble.speed * bubble.direction[0] * ms) / 1000.0;
        bubble.position[1] += (bubble.speed * bubble.direction[1] * ms) / 1000.0;
        return bubble;
    },
};
exports.default = basicMechanics;
