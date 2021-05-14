"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameMechs = ["basic", "scrapeoff", "bounce"];
exports.toGameMechanics = function (s) {
    if (s === "basic")
        return s;
    else if (s === "scrapeoff")
        return s;
    else if (s === "bounce")
        return s;
    else
        return null;
};
exports.isServerLobbyMessage = function (msg) {
    return msg.type === "lobbystate" || msg.type === "playerid";
};
