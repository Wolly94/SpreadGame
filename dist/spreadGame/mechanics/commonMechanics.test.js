"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = require("../bubble");
var commonMechanics_1 = require("./commonMechanics");
test("approaching", function () {
    var setupBubble = function (position, direction) {
        return bubble_1.createBubble({
            id: 0,
            position: position,
            targetId: 0,
            targetPos: [0, 0],
            units: 10,
            creationTime: 0,
            direction: direction,
            motherId: 0,
            playerId: 0,
        });
    };
    var position1 = [100, 0];
    var position2 = [0, 100];
    var direcitons1 = [
        [1, 0],
        [0, 1],
        [-1, 1],
    ];
    var results = [false, true, true];
    direcitons1.forEach(function (dir, index) {
        var b1 = setupBubble(position1, dir);
        var b2 = setupBubble(position2, [0, 0]);
        var approach = commonMechanics_1.approaching(b1, b2);
        expect(approach).toBe(results[index]);
    });
});
test("overlapCenter", function () {
    var pos1 = [100, 100];
    var pos2 = [110, 100];
    var b1 = bubble_1.createBubble({
        id: 0,
        position: pos1,
        direction: [0, 0],
        units: 50,
        targetPos: [1000, 1000],
        targetId: 0,
        motherId: 0,
        playerId: 0,
        creationTime: 0,
    });
    var b2 = bubble_1.createBubble({
        id: 1,
        position: pos2,
        direction: [0, 0],
        units: 50,
        targetPos: [1000, 1000],
        targetId: 0,
        motherId: 0,
        playerId: 0,
        creationTime: 0,
    });
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
        var fneutral = commonMechanics_1.fight(att, def, { combatAbilityModifier: 1 }, { combatAbilityModifier: 1 });
        var fPlusAttack = commonMechanics_1.fight(att, def, { combatAbilityModifier: am }, { combatAbilityModifier: 1 });
        var fPlusDefense = commonMechanics_1.fight(att, def, { combatAbilityModifier: 1 }, { combatAbilityModifier: dm });
        expect(fneutral).toBeCloseTo(rNeutral[index]);
        expect(fPlusAttack).toBeCloseTo(rPlusAttack[index]);
        expect(fPlusDefense).toBeCloseTo(rPlusDefense[index]);
    });
});
