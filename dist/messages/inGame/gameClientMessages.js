"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClientLobbyMessage = function (msg) {
    return !(msg.type === "sendunits" || msg.type === "getreplay");
};
