"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var basicMechanics_1 = __importDefault(require("../spreadGame/mechanics/basicMechanics"));
var growth_1 = require("../spreadGame/mechanics/events/growth");
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
        var weakestUnownedCells = aiHelper_1.sortByWeakestCells(cellsToTarget, myCells, this.reachable);
        if (weakestUnownedCells.length === 0)
            return null;
        var weakestUnownedCellData = weakestUnownedCells[0];
        if (weakestUnownedCellData.analyze.overshot <= 0) {
            // only attack from saturated cells
            var saturatedCells = myCells.filter(function (c) {
                var grow = basicMechanics_1.default.grow(c, 25, growth_1.growthUtils.default);
                return grow.units <= c.units;
            });
            if (saturatedCells.length > 0) {
                weakestUnownedCells = aiHelper_1.sortByWeakestCells(cellsToTarget, saturatedCells, this.reachable);
                if (weakestUnownedCells.length === 0)
                    return null;
                // this is where you should transfer to other friendly cells
                else {
                    weakestUnownedCellData = weakestUnownedCells[0];
                    weakestUnownedCellData.analyze.senderIds =
                        saturatedCells.map(function (c) { return c.id; });
                }
            }
            return null;
        }
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
