"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../../spreadGame");
var infectBubble_1 = require("../../spreadGame/mechanics/events/infectBubble");
var infectCell_1 = require("../../spreadGame/mechanics/events/infectCell");
var contaiguous_1 = require("./contaiguous");
test("contaiguous", function () {
    var _a, _b, _c, _d;
    var rep = contaiguous_1.ContaiguousPerk.replay;
    var game = spreadGame_1.SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 100);
    while (game.bubbles.length === 1) {
        game.runReplay(rep, rep.gameSettings.updateFrequencyInMs);
    }
    expect(game.bubbles.length).toBe(0);
    var cell1Units = (_a = game.cells.find(function (c) { return c.id === 1; })) === null || _a === void 0 ? void 0 : _a.units;
    while (game.bubbles.length === 0) {
        game.runReplay(rep, rep.gameSettings.updateFrequencyInMs);
    }
    expect(game.bubbles.length).toBe(1);
    var bubble = game.bubbles.find(function (b) { return b.id === 2; });
    var cell = game.cells.find(function (c) { return c.id === 1; });
    if (bubble === undefined || cell === undefined) {
        expect(true).toBe(false);
    }
    else {
        var infBubbleProps = infectBubble_1.infectBubbleUtils.collect(game.fromAttachedProps({ type: "Bubble", id: bubble.id }));
        expect(infBubbleProps.infectedBy.size).toBe(1);
        var infCellProps = infectCell_1.infectCellUtils.collect(game.fromAttachedProps({ type: "Cell", id: cell.id }));
        expect(infCellProps.infectedBy.size).toBe(1);
        var newCell1Units = (_b = game.cells.find(function (c) { return c.id === 1; })) === null || _b === void 0 ? void 0 : _b.units;
        var bubbleUnits = bubble.units;
        var lhs = cell1Units === undefined ? -2 : cell1Units;
        var rhs = newCell1Units === undefined || bubbleUnits === undefined
            ? -1
            : newCell1Units + bubbleUnits;
        expect(lhs).toBe(rhs);
        while (game.bubbles.length === 1) {
            game.runReplay(rep, rep.gameSettings.updateFrequencyInMs);
        }
        expect(game.bubbles.length).toBe(0);
        var cell2Units = (_c = game.cells.find(function (c) { return c.id === 2; })) === null || _c === void 0 ? void 0 : _c.units;
        expect(rep.lengthInMs - game.timePassed).toBeGreaterThan(2000);
        expect(rep.lengthInMs - game.timePassed).toBeLessThan(3000);
        game.runReplay(rep, 500);
        var newCell2Units = (_d = game.cells.find(function (c) { return c.id === 2; })) === null || _d === void 0 ? void 0 : _d.units;
        expect(cell2Units).toBe(newCell2Units);
    }
});
