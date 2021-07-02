"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ai_1 = require("../ai");
exports.evalAccessibility = function (senderInfos, receiver) {
    senderInfos.sort(function (si1, si2) { return si1.durationInMs - si2.durationInMs; });
};
exports.getAccessibility = function (game, receiverId, reachable) {
    var receiver = game.cells.find(function (c) { return c.id === receiverId; });
    if (receiver === undefined)
        return null;
    var senderInfos = game.cells.flatMap(function (sender) {
        var r = reachable.get(sender.id, receiver.id);
        if (r === null)
            return [];
        var attackers = ai_1.availableAttackers(sender);
        if (attackers === 0)
            return [];
        return [
            {
                cellId: sender.id,
                durationInMs: r.durationInMs,
                units: attackers,
            },
        ];
    });
    return { receiverId: receiverId, senderInfos: senderInfos };
};
