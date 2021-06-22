"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "RaiseEvent";
exports.isRaisableEvent = function (event) {
    return event.type === "StolenPerk" || event.type === "Infect";
};
exports.isRaisableEffect = function (effect) {
    return effect.type === "StolenPerk" || effect.type === "Infect";
};
