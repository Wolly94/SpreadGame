"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CellImpactCollectorImplementation = /** @class */ (function () {
    function CellImpactCollectorImplementation() {
        this.store = [];
    }
    CellImpactCollectorImplementation.prototype.get = function (senderId, receiverId) {
        var res = this.store.find(function (val) { return val.senderId === senderId && val.receiverId === receiverId; });
        if (res === undefined)
            return null;
        else
            return res.impact;
    };
    CellImpactCollectorImplementation.prototype.set = function (senderId, receiverId, imp) {
        var index = this.store.findIndex(function (val) { return val.senderId === senderId && val.receiverId === receiverId; });
        var val = {
            senderId: senderId,
            receiverId: receiverId,
            impact: imp,
        };
        if (index < 0)
            this.store.push(val);
        else
            this.store[index] = val;
    };
    return CellImpactCollectorImplementation;
}());
exports.CellImpactCollectorImplementation = CellImpactCollectorImplementation;
