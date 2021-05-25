"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = __importDefault(require("../bubble"));
var commonMechanics_1 = require("./commonMechanics");
test("overlapCenter", function () {
    var pos1 = [100, 100];
    var pos2 = [110, 100];
    var b1 = new bubble_1.default(0, pos1, [0, 0], 50, 0, 0, [1000, 1000]);
    var b2 = new bubble_1.default(0, pos2, [0, 0], 50, 0, 0, [1000, 1000]);
    var overl = commonMechanics_1.centerOverlap(b1, b2);
    expect(overl).toBe(40);
});
test("fight with modifiers", function () {
    var aUnits = [50, 50, 50];
    var dUnits = [40, 50, 60];
    var am = 11 / 10;
    var dm = 12 / 10;
    var rNeutral = [10, 0, -10];
    var rPlusAttack = [15 / am, 5 / am, -5];
    var rPlusDefense = [2, -10 / dm, -22 / dm];
    aUnits.forEach(function (att, index) {
        var def = dUnits[index];
        var fneutral = commonMechanics_1.fight(att, def, 1, 1);
        var fPlusAttack = commonMechanics_1.fight(att, def, am, 1);
        var fPlusDefense = commonMechanics_1.fight(att, def, 1, dm);
        expect(fneutral).toBeCloseTo(rNeutral[index]);
        expect(fPlusAttack).toBeCloseTo(rPlusAttack[index]);
        expect(fPlusDefense).toBeCloseTo(rPlusDefense[index]);
    });
});
