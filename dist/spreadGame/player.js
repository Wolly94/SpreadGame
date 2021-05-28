"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skilltree_1 = require("../skilltree/skilltree");
exports.playerFromData = function (playerData) {
    return {
        id: playerData.id,
        skills: skilltree_1.skillTreeMethods.toSkilledPerks(playerData.skills),
    };
};
exports.dataFromPlayer = function (player) {
    return {
        id: player.id,
        skills: skilltree_1.skillTreeMethods.toSkilledPerkData(player.skills),
    };
};
