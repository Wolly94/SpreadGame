"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseSpirit_1 = require("../perks/baseSpirit");
var kamikaze_1 = require("../perks/kamikaze");
exports.Spirit = {
    name: "Spirit",
    perks: [baseSpirit_1.BaseSpirit, kamikaze_1.Kamikaze],
};
