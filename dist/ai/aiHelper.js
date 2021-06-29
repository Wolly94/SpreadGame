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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commonMechanics_1 = require("../spreadGame/mechanics/commonMechanics");
var fight_1 = require("../spreadGame/mechanics/events/fight");
var ai_1 = require("./ai");
var reach_1 = require("./reach");
exports.isTarget = function (game, targetCellId, byPlayerId) {
    var remBubbles = game.bubbles.filter(function (b) { return b.targetId === targetCellId && b.playerId === byPlayerId; });
    return remBubbles.length > 0;
};
exports.analyzeCapturePlan = function (cells, targetCell, reachMap) {
    var attackerData = cells
        .flatMap(function (attackerCell) {
        var r = reachMap.get(attackerCell.id, targetCell.id);
        if (r === null)
            return [];
        var att = ai_1.availableAttackers(attackerCell);
        var realAtt = reach_1.getAttackerData(att, r);
        var data = __assign(__assign({}, realAtt), { senderId: attackerCell.id });
        return [data];
    })
        .sort(function (data1, data2) { return data1.durationInMs - data2.durationInMs; });
    var totalAttackers = attackerData.reduce(function (prev, curr) {
        return prev + curr.effectiveAttackers;
    }, 0);
    var analyzeData = attackerData.reduce(function (prev, curr) {
        if (prev.currentAttackers > prev.currentDefenders)
            return prev;
        var defenders = ai_1.estimatedDefenders(targetCell, curr.durationInMs);
        return {
            currentAttackers: prev.currentAttackers + curr.effectiveAttackers,
            currentDefenders: defenders,
            senderIds: __spreadArrays(prev.senderIds, [curr.senderId]),
            durationInMs: curr.durationInMs,
        };
    }, {
        currentAttackers: 0,
        currentDefenders: targetCell.units,
        senderIds: [],
        durationInMs: 0,
    });
    var overshot = commonMechanics_1.fight(analyzeData.currentAttackers, analyzeData.currentDefenders, fight_1.bubbleFightUtils.default, fight_1.cellFightUtils.default);
    return {
        maximalPossibleAttackers: totalAttackers,
        currentAttackers: analyzeData.currentAttackers,
        durationInMs: analyzeData.durationInMs,
        senderIds: analyzeData.senderIds,
        overshot: overshot,
    };
};
exports.sortByWeakestCells = function (cellsToTarget, cellsToSend, reach) {
    var weakestUnownedCells = cellsToTarget
        .map(function (c) {
        var analyzed = exports.analyzeCapturePlan(cellsToSend, c, reach);
        return { targetCell: c, analyze: analyzed };
    })
        .filter(function (data) {
        return data.analyze.senderIds.length !== 0;
    })
        .sort(function (c1, c2) {
        if (c1.analyze.durationInMs === c2.analyze.durationInMs) {
            // cells surrounded by stronger cells first
            return (c2.analyze.maximalPossibleAttackers -
                c1.analyze.maximalPossibleAttackers);
        }
        else {
            // closer cells first
            return c1.analyze.durationInMs - c2.analyze.durationInMs;
        }
    });
    return weakestUnownedCells;
};
