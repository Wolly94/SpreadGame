"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var basicMechanics_1 = __importDefault(require("./basicMechanics"));
var growth_1 = require("./events/growth");
test("units decreasing when too much", function () {
    var radius = 50;
    var maxUnits = common_1.radiusToUnits(50);
    var cell = {
        id: 0,
        playerId: 0,
        position: [100, 100],
        units: maxUnits * 2,
        radius: radius,
    };
    expect(cell.units).toBe(2 * maxUnits);
    var growth = common_1.radiusToGrowth(cell.radius);
    var msPerUnit = 1000 / growth;
    var ms = growth * 1000;
    cell = basicMechanics_1.default.grow(cell, msPerUnit, growth_1.growthUtils.default);
    expect(cell.units).toBe(2 * maxUnits - 1);
    cell = basicMechanics_1.default.grow(cell, msPerUnit, growth_1.growthUtils.default);
    cell = basicMechanics_1.default.grow(cell, msPerUnit * (maxUnits - 1), growth_1.growthUtils.default);
    expect(cell.units).toBe(maxUnits);
    cell = basicMechanics_1.default.grow(cell, msPerUnit, growth_1.growthUtils.default);
    expect(cell.units).toBe(maxUnits);
    cell = basicMechanics_1.default.grow(cell, 5 * msPerUnit, growth_1.growthUtils.default);
    expect(cell.units).toBe(maxUnits);
});
