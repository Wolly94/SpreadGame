"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("../../spreadGame/map/map");
exports.occupiedSeats = function (seatedPlayers) {
    return seatedPlayers.map(function (sp) { return sp.playerId; });
};
exports.idFromToken = function (token, seatedPlayers) {
    var sp = seatedPlayers.find(function (sp) { return sp.type === "human" && sp.token === token; });
    if (sp !== undefined)
        return sp.playerId;
    else
        return null;
};
exports.remainingSeats = function (map, seatedPlayers) {
    if (map === null) {
        return [];
    }
    var seats = map_1.getPlayerIds(map);
    var occSeats = exports.occupiedSeats(seatedPlayers);
    var remainingSeats = Array.from(seats).filter(function (id) { return !occSeats.includes(id); });
    return remainingSeats.sort(function (a, b) { return a - b; });
};
