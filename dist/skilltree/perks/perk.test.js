"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var perk_1 = require("./perk");
test("added all perks", function () {
    expect(perk_1.allPerks.length).toBe(perk_1.numberPerkCreators.length + perk_1.listPerkCreators.length);
});
