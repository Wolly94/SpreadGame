"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var entites_1 = require("../spreadGame/entites");
var ai_1 = require("./ai");
var reachableMap_1 = require("./reachableMap");
var realAttackerCount = function (attackers, reachType) {
    if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "scratch") {
        return Math.max(attackers, reachType.maxReceivableUnits);
    }
    else if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "basic") {
        if (attackers >= reachType.maxSendableUnits)
            return 0;
        else
            return attackers;
    }
    else if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "bounce") {
        return Math.max(0, attackers - reachType.absoluteUnitLoss);
    }
    else
        return 0;
};
var weightedDistance = function (receiver, senders, reachable) {
    var result = senders.reduce(function (prev, curr) {
        var dist = entites_1.distance(curr.position, receiver.position);
        var r = reachable.get(curr.id, receiver.id);
        var realAttackers = realAttackerCount(ai_1.availableAttackers(curr), r);
        return prev + realAttackers * dist;
    }, 0);
    return result;
};
var GreedyAi = /** @class */ (function () {
    function GreedyAi(settings, map, players, playerId) {
        this.playerId = playerId;
        var player = players.find(function (pl) { return pl.id === playerId; });
        var skills = player === undefined ? [] : player.skills;
        this.reachable = new reachableMap_1.ReachableImplementation(settings, map, skills);
    }
    GreedyAi.prototype.getMove = function (state) {
        var _this = this;
        var myCells = state.cells.filter(function (c) { return c.playerId === _this.playerId; });
        var weakestUnownedCells = state.cells
            .filter(function (c) { return c.playerId !== _this.playerId; })
            // closer cells first
            // weakest cells first
            .sort(function (c1, c2) {
            if (c1.units === c2.units) {
                var w1 = weightedDistance(c1, myCells, _this.reachable);
                var w2 = weightedDistance(c2, myCells, _this.reachable);
                return w1 - w2;
            }
            else
                return c1.units - c2.units;
        });
        if (weakestUnownedCells.length === 0)
            return null;
        var weakestUnownedCell = weakestUnownedCells[0];
        var sortedAttackerCells = state.cells
            .filter(function (c) { return c.playerId === _this.playerId; })
            .sort(function (c1, c2) {
            var r1 = _this.reachable.get(c1.id, weakestUnownedCell.id);
            var r2 = _this.reachable.get(c2.id, weakestUnownedCell.id);
            var d1 = ai_1.estimatedDefenders(weakestUnownedCell, r1 === null || r1 === void 0 ? void 0 : r1.durationInMs);
            var d2 = ai_1.estimatedDefenders(weakestUnownedCell, r2 === null || r2 === void 0 ? void 0 : r2.durationInMs);
            var a1 = realAttackerCount(ai_1.availableAttackers(c1), r1) -
                (d1 - weakestUnownedCell.units);
            var a2 = realAttackerCount(ai_1.availableAttackers(c2), r2) -
                (d2 - weakestUnownedCell.units);
            return a2 - a1;
        });
        var atts = sortedAttackerCells.reduce(function (prev, curr) {
            if (prev.totalAttackers > prev.currentDefenders)
                return prev;
            var r = _this.reachable.get(curr.id, weakestUnownedCell.id);
            if (r === undefined || r === null)
                return prev;
            var newDefs = Math.max(ai_1.estimatedDefenders(weakestUnownedCell, r.durationInMs), prev.currentDefenders);
            var realAttackers = realAttackerCount(ai_1.availableAttackers(curr), r);
            return {
                senderIds: __spreadArrays(prev.senderIds, [curr.id]),
                currentDefenders: newDefs,
                totalAttackers: prev.totalAttackers + realAttackers,
            };
        }, {
            senderIds: [],
            currentDefenders: weakestUnownedCell.units,
            totalAttackers: 0,
        });
        var result = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCell.id,
                senderIds: atts.senderIds,
                playerId: this.playerId,
            },
        };
        return result;
    };
    return GreedyAi;
}());
exports.GreedyAi = GreedyAi;
