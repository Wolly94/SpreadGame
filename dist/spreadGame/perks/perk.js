"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAttack_1 = require("./baseAttack");
var rage_1 = require("./rage");
exports.getPerkLevel = function (game, perkName, playerId) {
    var skPerk = game.getSkilledPerk(perkName, playerId);
    if (skPerk !== null)
        return skPerk.level;
    else
        return 0;
};
exports.getPerkValueHelper = function (level, values, defaultValue) {
    if (level <= 0)
        return defaultValue;
    else {
        var val = values[Math.min(level, values.length) - 1];
        return val;
    }
};
exports.getPerkValue = function (game, perkName, playerId, values, defaultValue) {
    var lvl = exports.getPerkLevel(game, perkName, playerId);
    var val = exports.getPerkValueHelper(lvl, values, defaultValue);
    return val;
};
exports.allPerks = [baseAttack_1.BaseAttackPerk(), rage_1.RagePerk()];
