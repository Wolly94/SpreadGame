"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PerPlayerImplementation = /** @class */ (function () {
    function PerPlayerImplementation() {
        this.store = [];
    }
    PerPlayerImplementation.prototype.get = function (playerId) {
        var res = this.store.find(function (s) { return s.playerId === playerId; });
        if (res === undefined)
            return null;
        else
            return res.data;
    };
    PerPlayerImplementation.prototype.set = function (playerId, data) {
        var index = this.store.findIndex(function (s) { return s.playerId === playerId; });
        if (index < 0)
            this.store.push({ playerId: playerId, data: data });
        else
            this.store[index].data = data;
    };
    return PerPlayerImplementation;
}());
exports.PerPlayerImplementation = PerPlayerImplementation;
