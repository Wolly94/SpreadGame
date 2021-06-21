"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var availableAttackers = function (cell) {
    return cell.data === null ? 0 : cell.data.units / 2;
};
var estimatedDefenders = function (attacker, defender) {
    return defender.data === null ? 25 : defender.data.units;
};
var getUnits = function (cell) {
    if (cell.data === null)
        return 100;
    else
        return cell.data.units;
};
var GreedyAi = /** @class */ (function () {
    function GreedyAi() {
    }
    GreedyAi.prototype.getMove = function (state, playerId) {
        var myCells = state.cells
            .filter(function (c) { return c.playerId === playerId; })
            .filter(function (c) { return c.data === null || c.data.units >= 15; })
            // strongest cells first
            .sort(function (c1, c2) { return getUnits(c2) - getUnits(c1); });
        var weakestUnownedCells = state.cells
            .filter(function (c) { return c.playerId !== playerId; })
            // weakest cells first
            .sort(function (c1, c2) { return getUnits(c1) - getUnits(c2); });
        if (weakestUnownedCells.length === 0)
            return null;
        var weakestUnownedCell = weakestUnownedCells[0];
        var senderIds = [];
        var attackers = myCells.reduce(function (units, cell) {
            if (units - 1 < getUnits(weakestUnownedCell)) {
                senderIds.push(cell.id);
                return units + availableAttackers(cell);
            }
            else {
                return units;
            }
        }, 0);
        if (attackers < getUnits(weakestUnownedCell))
            return null;
        var result = {
            type: "sendunitsmove",
            data: {
                receiverId: weakestUnownedCell.id,
                senderIds: senderIds,
                playerId: playerId,
            },
        };
        return result;
    };
    return GreedyAi;
}());
exports.GreedyAi = GreedyAi;
