"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = __importDefault(require("./bubble"));
var common_1 = require("./common");
var Cell = /** @class */ (function () {
    function Cell(id, playerId, position, units, radius) {
        this.id = id;
        this.playerId = playerId;
        this.position = position;
        this.units = units;
        this.radius = radius;
        this.growthPerSecond = common_1.radiusToGrowth(radius);
        this.saturatedUnitCount = common_1.radiusToUnits(radius);
    }
    Cell.prototype.availableAttackers = function () {
        var attacker = Math.floor(this.units / 2);
        return attacker;
    };
    Cell.prototype.trySend = function (target) {
        if (this.playerId == null)
            return null;
        var attacker = this.availableAttackers();
        this.units -= attacker;
        var direction = [
            target.position[0] - this.position[0],
            target.position[1] - this.position[1],
        ];
        var dist = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
        if (dist === 0)
            return null;
        var lambda = this.radius / dist;
        var normedDirection = [
            direction[0] / dist,
            direction[1] / dist,
        ];
        var position = [
            this.position[0] + lambda * direction[0],
            this.position[1] + lambda * direction[1],
        ];
        var bubble = new bubble_1.default(this.playerId, position, normedDirection, attacker, this.id, target.id, target.position);
        return bubble;
    };
    Cell.prototype.grow = function (ms) {
        var sign = this.units > this.saturatedUnitCount ? -1 : 1;
        var nextUnits = this.units + (sign * (this.growthPerSecond * ms)) / 1000;
        if ((nextUnits > this.saturatedUnitCount && sign === 1) ||
            (nextUnits < this.saturatedUnitCount && sign === -1)) {
            this.units = this.saturatedUnitCount;
        }
        else {
            this.units = nextUnits;
        }
    };
    return Cell;
}());
exports.default = Cell;
