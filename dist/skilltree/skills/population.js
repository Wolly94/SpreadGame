"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var basePopulation_1 = require("../perks/basePopulation");
var fertileGrounds_1 = require("../perks/fertileGrounds");
var reinforcements_1 = require("../perks/reinforcements");
exports.Population = {
    name: "Population",
    perks: [
        basePopulation_1.BasePopulationPerk.createFromValues(),
        fertileGrounds_1.FertileGroundsPerk.createFromValues(),
        reinforcements_1.ReinforcementsPerk.createFromValues(),
    ],
};
