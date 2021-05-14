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
