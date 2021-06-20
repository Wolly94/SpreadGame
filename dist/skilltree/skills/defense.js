"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseDefense_1 = require("../perks/baseDefense");
var lootsOfVictory_1 = require("../perks/lootsOfVictory");
var membrane_1 = require("../perks/membrane");
var preparation_1 = require("../perks/preparation");
exports.Defense = {
    name: "Defense",
    perks: [
        baseDefense_1.BaseDefensePerk.createFromValues(),
        preparation_1.PreparationPerk.createFromValues(),
        lootsOfVictory_1.LootsOfVictoryPerk.createFromValues(),
        membrane_1.MembranePerk.createFromValues(),
    ],
};
