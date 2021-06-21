"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame/spreadGame");
var rage_1 = require("./rage");
test("test rage", function () {
    var rep = __assign(__assign({}, rage_1.RagePerk.replay), { lengthInMs: 10000 });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 3000);
    var clientState = game.toClientGameState();
    var ragedBubbles = clientState.bubbles.filter(function (bubble) {
        return bubble.data !== null && bubble.data.attackCombatAbilities > 0;
    });
    expect(ragedBubbles.length).toBe(1);
    game.runReplay(rep, 2000);
    clientState = game.toClientGameState();
    var secondLostCell = clientState.cells.find(function (ce) { return ce.id === 2; });
    expect(secondLostCell === null || secondLostCell === void 0 ? void 0 : secondLostCell.playerId).toBe(0);
    game.runReplay(rep, 3000);
    game.sendUnits(0, [0], 1);
    game.run(1000, rep.gameSettings.updateFrequencyInMs);
    clientState = game.toClientGameState();
    expect(clientState.bubbles.length).toBe(1);
    ragedBubbles = clientState.bubbles.filter(function (bubble) {
        return bubble.data !== null && bubble.data.attackCombatAbilities > 0;
    });
    expect(ragedBubbles.length).toBe(0);
});
test("test no rage", function () {
    var rep = __assign(__assign({}, rage_1.RagePerk.replay), { perks: [] });
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 3000);
    var clientState = game.toClientGameState();
    var ragedBubbles = clientState.bubbles.filter(function (bubble) {
        return bubble.data !== null && bubble.data.attackCombatAbilities > 1;
    });
    expect(ragedBubbles.length).toBe(0);
});
