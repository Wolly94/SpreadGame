"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTarget = function (game, targetCellId, byPlayerId) {
    var remBubbles = game.bubbles.filter(function (b) { return b.targetId === targetCellId && b.playerId === byPlayerId; });
    return remBubbles.length > 0;
};
