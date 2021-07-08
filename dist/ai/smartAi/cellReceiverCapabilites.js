"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reach_1 = require("../reach");
var perPlayer_1 = require("./perPlayer");
exports.evalReceiverData = function (recData) {
    var sorted = recData.timeline.sort(function (rd1, rd2) {
        return rd1.latestPossibleReceiverTimeInMs -
            rd2.latestPossibleReceiverTimeInMs;
    });
    var timestamps = sorted
        .map(function (rd) { return rd.latestPossibleReceiverTimeInMs; })
        .filter(function (val, index, arr) { return index === 0 || arr[index - 1] !== val; });
    var res = timestamps.map(function (timeStamp) {
        var relevant = recData.timeline.filter(function (rd) {
            return rd.earliestPossibleReceiverTimeInMs < timeStamp &&
                timeStamp <= rd.latestPossibleReceiverTimeInMs;
        });
        var perPlayer = new perPlayer_1.PerPlayerImplementation();
        relevant.forEach(function (rel) {
            var ex = perPlayer.get(rel.senderPlayerId);
            if (ex === null)
                ex = 0;
            perPlayer.set(rel.senderPlayerId, ex + rel.units);
        });
        return { timestamp: timeStamp, data: perPlayer };
    });
    return res;
};
var CellReceiverCapabilityImplementation = /** @class */ (function () {
    function CellReceiverCapabilityImplementation(reachMap, cellIds, senderCaps) {
        var _this = this;
        this.store = [];
        cellIds.forEach(function (receiverId) {
            var recData = [];
            cellIds.forEach(function (senderId) {
                if (senderId === receiverId)
                    return;
                var reach = reachMap.get(senderId, receiverId);
                if (reach === null)
                    return;
                var senderData = senderCaps.get(senderId);
                if (senderData === null)
                    return;
                recData.push.apply(recData, senderData.timeline.map(function (us) {
                    var attData = reach_1.getAttackerData(us.availableAttackers, reach);
                    return {
                        units: attData.effectiveAttackers,
                        earliestPossibleReceiverTimeInMs: us.earliestPossibleTimeInMs +
                            attData.durationInMs,
                        latestPossibleReceiverTimeInMs: us.latestPossibleTimeInMs === null
                            ? Infinity
                            : us.latestPossibleTimeInMs +
                                attData.durationInMs,
                        durationInMs: attData.durationInMs,
                        senderPlayerId: us.senderPlayerId,
                    };
                }));
            });
            _this.set(receiverId, { timeline: recData });
        });
    }
    CellReceiverCapabilityImplementation.prototype.get = function (receiverId) {
        var res = this.store.find(function (val) { return val.receiverId === receiverId; });
        if (res === undefined)
            return null;
        else
            return res.impact;
    };
    CellReceiverCapabilityImplementation.prototype.set = function (receiverId, imp) {
        imp.timeline.sort(function (ur1, ur2) {
            var diffArrival = ur1.earliestPossibleReceiverTimeInMs +
                ur1.durationInMs -
                (ur2.earliestPossibleReceiverTimeInMs + ur2.durationInMs);
            if (diffArrival !== 0)
                return diffArrival;
            if (ur1.latestPossibleReceiverTimeInMs === null ||
                ur2.latestPossibleReceiverTimeInMs === null) {
                if (ur1.latestPossibleReceiverTimeInMs ===
                    ur2.latestPossibleReceiverTimeInMs)
                    return ur1.units - ur2.units;
                else
                    return ur1.latestPossibleReceiverTimeInMs === null ? 1 : -1;
            }
            else
                return (ur1.latestPossibleReceiverTimeInMs +
                    ur1.durationInMs -
                    (ur2.latestPossibleReceiverTimeInMs + ur2.durationInMs));
        });
        var index = this.store.findIndex(function (val) { return val.receiverId === receiverId; });
        var val = {
            receiverId: receiverId,
            impact: imp,
        };
        if (index < 0)
            this.store.push(val);
        else
            this.store[index] = val;
    };
    return CellReceiverCapabilityImplementation;
}());
exports.CellReceiverCapabilityImplementation = CellReceiverCapabilityImplementation;
