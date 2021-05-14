"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cell_1 = __importDefault(require("../cell"));
var common_1 = require("../common");
test("units decreasing when too much", function () {
    var radius = 50;
    var maxUnits = common_1.radiusToUnits(50);
    var cell = new cell_1.default(0, 0, [100, 100], maxUnits * 2, radius);
    expect(cell.units).toBe(2 * maxUnits);
    var msPerUnit = 1000 / cell.growthPerSecond;
    var ms = cell.growthPerSecond * 1000;
    cell.grow(msPerUnit);
    expect(cell.units).toBe(2 * maxUnits - 1);
    cell.grow(msPerUnit * (maxUnits - 1));
    expect(cell.units).toBe(maxUnits);
    cell.grow(msPerUnit);
    expect(cell.units).toBe(maxUnits);
    cell.grow(5 * msPerUnit);
    expect(cell.units).toBe(maxUnits);
});
