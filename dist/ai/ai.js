"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var basicMechanics_1 = __importDefault(require("../spreadGame/mechanics/basicMechanics"));
var growth_1 = require("../spreadGame/mechanics/events/growth");
var sendUnits_1 = require("../spreadGame/mechanics/events/sendUnits");
exports.availableAttackers = function (cell) {
    var dummyCell = {
        id: -1,
        playerId: 0,
        position: [-100, -100],
        radius: 50,
        units: 50,
    };
    var _a = basicMechanics_1.default.sendBubble(cell, dummyCell, 0, sendUnits_1.sendUnitsUtils.default), newCell = _a[0], newBubble = _a[1];
    return newBubble === null ? 0 : newBubble.units;
};
exports.estimatedDefenders = function (defender, durationInMs) {
    if (durationInMs === null || durationInMs === undefined)
        return defender.units;
    var newCell = basicMechanics_1.default.grow(defender, durationInMs, growth_1.growthUtils.default);
    return newCell.units;
};
