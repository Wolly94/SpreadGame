"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reachableMap_1 = require("../reachableMap");
var ForecastAi = /** @class */ (function () {
    function ForecastAi(settings, map, players, playerId) {
        var player = players.find(function (pl) { return pl.id === playerId; });
        var skills = player === undefined ? [] : player.skills;
        this.reachable = new reachableMap_1.ReachableImplementation(settings, map, skills);
        this.playerId = playerId;
    }
    ForecastAi.prototype.getMove = function (state) {
        return null;
    };
    return ForecastAi;
}());
exports.ForecastAi = ForecastAi;
