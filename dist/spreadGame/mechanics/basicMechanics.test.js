"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = __importDefault(require("../bubble"));
var basicMechanics_1 = __importDefault(require("./basicMechanics"));
test("collide 50 vs 25 units", function () {
    var u1 = 50;
    var u2 = 25;
    var b1 = new bubble_1.default(0, [0, 0], [0, 0], u1, 0, 0, [1000, 1000]);
    var b2 = new bubble_1.default(1, [0, 0], [0, 0], u2, 0, 0, [1000, 1000]);
    var res = basicMechanics_1.default.collideBubble(b1, b2, {});
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
    var b1 = new bubble_1.default(0, [0, 0], [0, 0], u1, 0, 0, [1000, 1000]);
    var b2 = new bubble_1.default(1, [0, 0], [0, 0], u2, 0, 0, [1000, 1000]);
    var res = basicMechanics_1.default.collideBubble(b1, b2, {});
    expect(res[0]).toBe(null);
    expect(res[1]).toBe(null);
});
test("collide 25 vs 50 units", function () {
    var u1 = 25;
    var u2 = 50;
    var b1 = new bubble_1.default(0, [0, 0], [0, 0], u1, 0, 0, [1000, 1000]);
    var b2 = new bubble_1.default(1, [0, 0], [0, 0], u2, 0, 0, [1000, 1000]);
    var res = basicMechanics_1.default.collideBubble(b1, b2, {});
    expect(res[0]).toBe(null);
    expect(res[1]).not.toBe(null);
    if (res[1] === null) {
        expect(true).toBe(false);
    }
    else {
        expect(res[1].units).toBe(u2 - u1);
    }
});
