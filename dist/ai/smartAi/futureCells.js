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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prioritizeCells = function (game, playerId) {
    var forecast = exports.getForecast(game);
    var end = exports.forecastEnd(forecast);
};
exports.forecastEnd = function (cellChanges) {
    var latestCells = [];
    cellChanges.forEach(function (hc) {
        var index = latestCells.findIndex(function (c) { return c.data.cell.id === hc.data.id; });
        if (index < 0) {
            latestCells.push({
                timestamp: hc.timestamp,
                data: { cell: hc.data, lastCapture: null },
            });
        }
        else {
            if (latestCells[index].data.cell.playerId !== hc.data.playerId) {
                latestCells[index] = {
                    timestamp: hc.timestamp,
                    data: {
                        cell: hc.data,
                        lastCapture: {
                            cell: __assign({}, hc.data),
                            timePassedInMs: hc.timestamp,
                        },
                    },
                };
            }
            else {
                latestCells[index].timestamp = hc.timestamp;
                latestCells[index].data.cell = hc.data;
            }
        }
    });
    return latestCells;
};
exports.getForecast = function (game) {
    var cellChanges = [];
    var copied = game.copy();
    var currentBubbles = copied.bubbles;
    var timePassedUntilNow = game.timePassed;
    while (copied.bubbles.length > 0) {
        copied.step(copied.gameSettings.updateFrequencyInMs);
        if (currentBubbles.length !== copied.bubbles.length) {
            var terminatedBubbles = currentBubbles.filter(function (backedUp) { return !copied.bubbles.some(function (b) { return b.id === backedUp.id; }); });
            var cellsChangedNow = terminatedBubbles.flatMap(function (bubble) {
                return game.eventHistory.flatMap(function (ev) {
                    if (ev.data.type === "CollisionEvent" &&
                        ev.data.before.bubble.id === bubble.id &&
                        ev.data.after.other.type === "Cell") {
                        return [ev.data.after.other.val];
                    }
                    else
                        return [];
                });
            });
            cellsChangedNow.forEach(function (chn) {
                return cellChanges.push({
                    timestamp: copied.timePassed - timePassedUntilNow,
                    data: chn,
                });
            });
            currentBubbles = copied.bubbles;
        }
    }
    return cellChanges;
};
