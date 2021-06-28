"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var basicMechanics_1 = __importDefault(require("../spreadGame/mechanics/basicMechanics"));
var sendUnits_1 = require("../spreadGame/mechanics/events/sendUnits");
var reach_1 = require("./reach");
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
    function GreedyAi(settings, map, players, perks, playerId) {
        var _this = this;
        this.reachable = new Map();
        var player = players.find(function (pl) { return pl.id === playerId; });
        var skills = player === undefined ? [] : player.skills;
        map.cells.forEach(function (senderCell) {
            map.cells
                .filter(function (c) { return c.id !== senderCell.id; })
                .forEach(function (receiverCell) {
                var r = reach_1.reach(map, settings, skills, senderCell.id, receiverCell.id);
                _this.reachable.set([senderCell.id, receiverCell.id], r);
            });
        });
    }
    GreedyAi.prototype.getMove = function (state, playerId) {
        var myCells = state.cells
            .filter(function (c) { return c.playerId === playerId; })
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
                return units + exports.availableAttackers(cell);
            }
            else {
                return units;
            }
        }, 0);
        if (attackers < weakestUnownedCell.units)
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
