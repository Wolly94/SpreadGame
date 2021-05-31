"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = require("../bubble");
var basicMechanics_1 = __importDefault(require("./basicMechanics"));
test("collide 50 vs 25 units", function () {
    var u1 = 50;
    var u2 = 25;
    var b1 = bubble_1.createBubble({
        id: 0,
        playerId: 0,
        position: [0, 0],
        direction: [0, 0],
        units: u1,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var b2 = bubble_1.createBubble({
        id: 1,
        playerId: 1,
        position: [0, 0],
        direction: [0, 0],
        units: u2,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var res = basicMechanics_1.default.collideBubble(b1, b2, { attackModifier: 1.0 }, { attackModifier: 1.0 });
    expect(res[0]).not.toBe(null);
    expect(res[1]).toBe(null);
    if (res[0] === null) {
        expect(true).toBe(false);
    }
    else {
        expect(res[0].units).toBe(u1 - u2);
    }
});
test("collide 50 vs 50 units", function () {
    var u1 = 50;
    var u2 = 50;
    var b1 = bubble_1.createBubble({
        id: 0,
        playerId: 0,
        position: [0, 0],
        direction: [0, 0],
        units: u1,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var b2 = bubble_1.createBubble({
        id: 1,
        playerId: 1,
        position: [0, 0],
        direction: [0, 0],
        units: u2,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var res = basicMechanics_1.default.collideBubble(b1, b2, { attackModifier: 1.0 }, { attackModifier: 1.0 });
    expect(res[0]).toBe(null);
    expect(res[1]).toBe(null);
});
test("collide 25 vs 50 units", function () {
    var u1 = 25;
    var u2 = 50;
    var b1 = bubble_1.createBubble({
        id: 0,
        playerId: 0,
        position: [0, 0],
        direction: [0, 0],
        units: u1,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var b2 = bubble_1.createBubble({
        id: 1,
        playerId: 1,
        position: [0, 0],
        direction: [0, 0],
        units: u2,
        targetId: 0,
        targetPos: [1000, 1000],
        motherId: 0,
        creationTime: 0,
    });
    var res = basicMechanics_1.default.collideBubble(b1, b2, { attackModifier: 1.0 }, { attackModifier: 1.0 });
    expect(res[0]).toBe(null);
    expect(res[1]).not.toBe(null);
    if (res[1] === null) {
        expect(true).toBe(false);
    }
    else {
        expect(res[1].units).toBe(u2 - u1);
    }
});
