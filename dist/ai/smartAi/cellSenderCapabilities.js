"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var futureCells_1 = require("./futureCells");
var CellSenderCapabilityImplementation = /** @class */ (function () {
    function CellSenderCapabilityImplementation(futCells) {
        var _this = this;
        this.store = [];
        futCells.forEach(function (futCell) {
            var currentTimePassed = 0;
            var timeline = futCell.history.flatMap(function (ch) {
                if (ch.data.playerId === null)
                    return [];
                currentTimePassed = ch.timestamp;
                return [
                    {
                        availableAttackers: ch.data.sendableUnits,
                        senderCellId: futCell.cellId,
                        senderPlayerId: ch.data.playerId,
                        earliestPossibleTimeInMs: ch.timestamp,
                        // this is used as a placeholder for the loop below:
                        latestPossibleTimeInMs: ch.data.immobilizedBeforeDurationInMs,
                    },
                ];
            });
            timeline.forEach(function (tl, index, arr) {
                if (index !== 0 && tl.latestPossibleTimeInMs !== null)
                    arr[index - 1].latestPossibleTimeInMs =
                        tl.earliestPossibleTimeInMs - tl.latestPossibleTimeInMs;
                tl.latestPossibleTimeInMs = null;
            });
            _this.set(futCell.cellId, { timeline: timeline });
        });
    }
    CellSenderCapabilityImplementation.fromGame = function (game) {
        var futureCells = futureCells_1.futureCellsFromGame(game);
        return new CellSenderCapabilityImplementation(futureCells);
    };
    CellSenderCapabilityImplementation.prototype.get = function (senderId) {
        var res = this.store.find(function (val) { return val.senderId === senderId; });
        if (res === undefined)
            return null;
        else
            return res.impact;
    };
    CellSenderCapabilityImplementation.prototype.set = function (senderId, imp) {
        var index = this.store.findIndex(function (val) { return val.senderId === senderId; });
        var val = {
            senderId: senderId,
            impact: imp,
        };
        if (index < 0)
            this.store.push(val);
        else
            this.store[index] = val;
    };
    return CellSenderCapabilityImplementation;
}());
exports.CellSenderCapabilityImplementation = CellSenderCapabilityImplementation;
