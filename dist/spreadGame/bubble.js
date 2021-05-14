"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var bubbleIds = 0;
var Bubble = /** @class */ (function () {
    function Bubble(playerId, position, direction, units, motherId, targetId, targetPos) {
        this.id = bubbleIds;
        bubbleIds += 1;
        this.playerId = playerId;
        this.position = position;
        this.direction = direction;
        this.units = units;
        this.motherId = motherId;
        this.speed = 90;
        this.targetId = targetId;
        this.targetPos = targetPos;
        this.radius = common_1.unitsToRadius(units);
    }
    Bubble.prototype.updateRadius = function () {
        this.radius = common_1.unitsToRadius(this.units);
    };
    return Bubble;
}());
exports.default = Bubble;
