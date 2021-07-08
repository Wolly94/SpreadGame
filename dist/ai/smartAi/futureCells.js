"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../../skilltree/events");
var ai_1 = require("../ai");
exports.futureCellsFromGame = function (game) {
    var copied = game.copy();
    while (copied.bubbles.length > 0) {
        copied.step(game.gameSettings.updateFrequencyInMs);
    }
    var collisionEvents = copied.eventHistory.filter(function (ev) {
        return ev.data.type === "CollisionEvent";
    });
    var res = copied.cells.map(function (sender) {
        var cellHistory = [];
        var initialCell = game.cells.find(function (c) { return c.id === sender.id; });
        if (initialCell !== undefined) {
            cellHistory.push({
                timestamp: game.timePassed,
                data: {
                    playerId: initialCell.playerId,
                    units: initialCell.units,
                    sendableUnits: ai_1.availableAttackers(initialCell),
                    immobilizedBeforeDurationInMs: 0,
                },
            });
        }
        collisionEvents.forEach(function (ev) {
            if (ev.data.after.other.type !== "Cell" ||
                ev.data.after.other.val.id !== sender.id)
                return;
            var newOwnerId = ev.data.after.other.val.playerId;
            if (newOwnerId === null)
                return; // this should be impossible
            var finishTime = events_1.getFinishTime(ev.data);
            if (finishTime === null)
                return;
            var sendableUnits = ai_1.availableAttackers(ev.data.after.other.val);
            cellHistory.push({
                timestamp: finishTime,
                data: {
                    immobilizedBeforeDurationInMs: finishTime - ev.timestamp,
                    playerId: newOwnerId,
                    units: ev.data.after.other.val.units,
                    sendableUnits: sendableUnits,
                },
            });
        });
        return {
            cellId: sender.id,
            history: cellHistory,
        };
    });
    return res;
};
