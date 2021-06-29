"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reach_1 = require("./reach");
var ReachableImplementation = /** @class */ (function () {
    function ReachableImplementation(settings, map, skills) {
        var _this = this;
        this.store = [];
        map.cells.forEach(function (senderCell) {
            map.cells
                .filter(function (c) { return c.id !== senderCell.id; })
                .forEach(function (receiverCell) {
                var r = reach_1.reach(map, settings, skills, senderCell.id, receiverCell.id);
                if (r !== null)
                    _this.store.push({
                        senderId: senderCell.id,
                        receiverId: receiverCell.id,
                        reachType: r,
                    });
            });
        });
    }
    ReachableImplementation.prototype.get = function (senderId, receiverId) {
        var res = this.store.find(function (val) { return val.senderId === senderId && val.receiverId === receiverId; });
        if (res === undefined)
            return null;
        else
            return res.reachType;
    };
    ReachableImplementation.prototype.set = function (senderId, receiverId, reachType) {
        var index = this.store.findIndex(function (val) { return val.senderId === senderId && val.receiverId === receiverId; });
        var val = { senderId: senderId, receiverId: receiverId, reachType: reachType };
        if (index < 0)
            this.store.push(val);
        else
            this.store[index] = val;
    };
    return ReachableImplementation;
}());
exports.ReachableImplementation = ReachableImplementation;
