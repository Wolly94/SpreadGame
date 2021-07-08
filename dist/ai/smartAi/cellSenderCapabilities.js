"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../../skilltree/events");
var ai_1 = require("../ai");
var CellSenderCapabilityImplementation = /** @class */ (function () {
    function CellSenderCapabilityImplementation(collisionEvents, cells, timePassedInMs) {
        var _this = this;
        this.store = [];
        cells.forEach(function (sender) {
            var timeline = [];
            if (sender.playerId !== null) {
                timeline.push({
                    senderCellId: sender.id,
                    senderPlayerId: sender.playerId,
                    earliestPossibleTimeInMs: timePassedInMs,
                    latestPossibleTimeInMs: null,
                    availableAttackers: ai_1.availableAttackers(sender),
                });
            }
            collisionEvents.forEach(function (ev) {
                if (ev.data.after.other.type !== "Cell" ||
                    ev.data.after.other.val.id !== sender.id)
                    return;
                var newOwnerId = ev.data.after.other.val.playerId;
                if (newOwnerId === null)
                    return;
                var finishTime = events_1.getFinishTime(ev.data);
                if (finishTime === null)
                    return;
                var sendableUnits = ai_1.availableAttackers(ev.data.after.other.val);
                if (timeline.length > 0) {
                    // set latest possible time to the starting time of the event
                    timeline[timeline.length - 1].latestPossibleTimeInMs =
                        ev.timestamp;
                }
                timeline.push({
                    availableAttackers: sendableUnits,
                    senderCellId: sender.id,
                    senderPlayerId: newOwnerId,
                    earliestPossibleTimeInMs: finishTime,
                    latestPossibleTimeInMs: null,
                });
            });
            _this.set(sender.id, { timeline: timeline });
        });
    }
    CellSenderCapabilityImplementation.fromGame = function (game) {
        var copied = game.copy();
        while (copied.bubbles.length > 0) {
            copied.step(game.gameSettings.updateFrequencyInMs);
        }
        var collisionEvents = copied.eventHistory.filter(function (ev) {
            return ev.data.type === "CollisionEvent";
        });
        var senderCaps = new CellSenderCapabilityImplementation(collisionEvents, game.cells, game.timePassed);
        return senderCaps;
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
