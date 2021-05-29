"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame");
var rage_1 = require("./rage");
test("test rage", function () {
    var rep = rage_1.Rage.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rage_1.Rage.replay);
    game.runReplay(rep, 3000);
    var clientState = game.toClientGameState();
    var ragedBubbles = clientState.bubbles.filter(function (bubble) { return bubble.rage; });
    expect(ragedBubbles.length).toBe(1);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    var secondLostCell = clientState.cells.find(function (ce) { return ce.id === 2; });
    expect(secondLostCell === null || secondLostCell === void 0 ? void 0 : secondLostCell.playerId).toBe(0);
});
