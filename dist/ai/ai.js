"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var availableAttackers = function (cell) {
    return cell.units / 2;
};
var estimatedDefenders = function (attacker, defender) {
    return defender.units;
};
var GreedyAi = /** @class */ (function () {
    function GreedyAi() {
    }
    GreedyAi.prototype.getMove = function (state, playerId) {
        var myCells = state.cells
            .filter(function (c) { return c.playerId === playerId; })
            .filter(function (c) { return c.units >= 15; })
            // strongest cells first
            .sort(function (c1, c2) { return c2.units - c1.units; });
        var weakestUnownedCells = state.cells
            .filter(function (c) { return c.playerId !== playerId; })
            // weakest cells first
            .sort(function (c1, c2) { return c1.units - c2.units; });
        if (weakestUnownedCells.length === 0)
            return null;
        var weakestUnownedCell = weakestUnownedCells[0];
        var senderIds = [];
        var attackers = myCells.reduce(function (units, cell) {
            if (units - 1 < weakestUnownedCell.units) {
                senderIds.push(cell.id);
                return units + availableAttackers(cell);
            }
            else {
                return units;
            }
        }, 0);
        if (attackers < weakestUnownedCell.units)
            return null;
        var result = {
            type: "sendunits",
            data: { receiverId: weakestUnownedCell.id, senderIds: senderIds },
        };
        return result;
    };
    return GreedyAi;
}());
exports.GreedyAi = GreedyAi;
