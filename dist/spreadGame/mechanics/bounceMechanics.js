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
var entites_1 = require("../entites");
var basicMechanics_1 = __importDefault(require("./basicMechanics"));
var commonMechanics_1 = require("./commonMechanics");
var scrapeOffMechanics_1 = __importDefault(require("./scrapeOffMechanics"));
var minUnitsOnBounce = 1;
var onb = function (e1) {
    return [-e1[1], e1[0]];
};
var scalarMul = function (l, v) { return [v[0] * l, v[1] * l]; };
var mul = function (v1, v2) { return v1[0] * v2[0] + v1[1] * v2[1]; };
var add = function () {
    var v = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        v[_i] = arguments[_i];
    }
    return [v.reduce(function (s, v) { return v[0] + s; }, 0), v.reduce(function (s, v) { return v[1] + s; }, 0)];
};
var normalize = function (v) {
    var length = entites_1.distance(v, [0, 0]);
    if (length <= 0.001)
        return null;
    else
        return scalarMul(1 / length, v);
};
var difference = function (pos1, pos2) {
    return [pos1[0] - pos2[0], pos1[1] - pos2[1]];
};
var rotate = function (v, angle) {
    // cos a  -sin a
    // sin a  cos a
    var co = Math.cos(angle);
    var si = Math.sin(angle);
    var res = [co * v[0] - si * v[1], si * v[0] + co * v[1]];
    return res;
};
var adjustedDirection = function (bubblePos, bubbleDir, targetPos) {
    var requiredAccuracy = 0.01;
    var baseAngle = (10 / 360) * 2 * Math.PI;
    var dirToTarget = normalize(difference(targetPos, bubblePos));
    if (dirToTarget === null)
        return bubbleDir;
    var dirMistake = entites_1.distance(dirToTarget, bubbleDir);
    if (dirMistake <= requiredAccuracy)
        return bubbleDir;
    var n = onb(dirToTarget);
    var coords = [
        mul(dirToTarget, bubbleDir),
        mul(n, bubbleDir),
    ];
    var wrongSide = coords[0] < 0;
    var wrongPart = coords[1];
    var scale = dirMistake / 3;
    if (wrongPart >= 0) {
        return rotate(bubbleDir, -baseAngle * scale);
    }
    else {
        return rotate(bubbleDir, +baseAngle * scale);
    }
};
var bounceMechanics = {
    collideBubble: function (bubble1, bubble2, f1, f2) {
        return scrapeOffMechanics_1.default.collideBubble(bubble1, bubble2, f1, f2);
    },
    collideCell: function (bubble, cell, f1, f2) {
        // bubble reached its destiny?
        if (bubble.targetId === cell.id) {
            return basicMechanics_1.default.collideCell(bubble, cell, f1, f2);
        }
        if (commonMechanics_1.overlap(bubble, cell) < commonMechanics_1.calculationAccuracy)
            return __assign({}, bubble);
        var fighters = Math.min(minUnitsOnBounce, bubble.units, cell.units);
        var resBubble = bubble_1.setUnits(bubble, bubble.units - fighters);
        if (cell.playerId === resBubble.playerId) {
            commonMechanics_1.reinforceCell(cell, fighters);
        }
        else {
            var cellRem = commonMechanics_1.fight(fighters, cell.units, 1, 1);
            commonMechanics_1.takeOverCell(cell, cellRem, resBubble.playerId);
        }
        var dirToCell = normalize(difference(cell.position, resBubble.position));
        if (dirToCell === null)
            return basicMechanics_1.default.collideCell(resBubble, cell, f1, f2);
        var newDirection = difference(resBubble.direction, scalarMul(2 * mul(dirToCell, resBubble.direction), dirToCell));
        resBubble.direction = newDirection;
        return resBubble;
    },
    move: function (bubble, ms) {
        bubble = basicMechanics_1.default.move(bubble, ms);
        bubble.direction = adjustedDirection(bubble.position, bubble.direction, bubble.targetPos);
        return bubble;
    },
    grow: basicMechanics_1.default.grow,
    sendBubble: basicMechanics_1.default.sendBubble,
};
exports.default = bounceMechanics;
