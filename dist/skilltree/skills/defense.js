"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseDefense_1 = require("../perks/baseDefense");
var lootsOfVictory_1 = require("../perks/lootsOfVictory");
var membrane_1 = require("../perks/membrane");
var preparation_1 = require("../perks/preparation");
exports.Defense = {
    name: "Defense",
    perks: [baseDefense_1.BaseDefense, preparation_1.Preparation, lootsOfVictory_1.LootsOfVictory, membrane_1.Membrane],
};
