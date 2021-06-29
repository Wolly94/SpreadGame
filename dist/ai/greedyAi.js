"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aiHelper_1 = require("./aiHelper");
var reachableMap_1 = require("./reachableMap");
var GreedyAi = /** @class */ (function () {
    function GreedyAi(settings, map, players, playerId) {
        var player = players.find(function (pl) { return pl.id === playerId; });
        var skills = player === undefined ? [] : player.skills;
        this.reachable = new reachableMap_1.ReachableImplementation(settings, map, skills);
        this.playerId = playerId;
    }
    GreedyAi.prototype.getMove = function (state) {
        var _this = this;
        var myCells = state.cells.filter(function (c) { return c.playerId === _this.playerId; });
        var cellsToTarget = state.cells.filter(function (cell) {
            return cell.playerId !== _this.playerId &&
                !aiHelper_1.isTarget(state, cell.id, _this.playerId);
        });
        var weakestUnownedCells = cellsToTarget
            .map(function (c) {
            var analyzed = aiHelper_1.analyzeCapturePlan(myCells, c, _this.reachable);
            return { targetCell: c, analyze: analyzed };
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
        if (weakestUnownedCells.length === 0)
            return null;
        var weakestUnownedCellData = weakestUnownedCells[0];
        if (weakestUnownedCellData.analyze.overshot < 0 &&
            state.bubbles.filter(function (b) { return b.playerId === _this.playerId; }).length !==
                0)
            return null;
        var result = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCellData.targetCell.id,
                senderIds: weakestUnownedCellData.analyze.senderIds,
                playerId: this.playerId,
            },
        };
        return result;
    };
    return GreedyAi;
}());
exports.GreedyAi = GreedyAi;
