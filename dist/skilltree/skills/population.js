"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var basePopulation_1 = require("../perks/basePopulation");
var fertileGrounds_1 = require("../perks/fertileGrounds");
exports.Population = {
    name: "Population",
    perks: [
        basePopulation_1.BasePopulationPerk.createFromValues(),
        fertileGrounds_1.FertileGroundsPerk.createFromValues(),
    ],
};
