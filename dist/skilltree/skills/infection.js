"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseInfection_1 = require("../perks/baseInfection");
var contaiguous_1 = require("../perks/contaiguous");
var deadlyEnvironment_1 = require("../perks/deadlyEnvironment");
exports.Infection = {
    name: "Infection",
    perks: [
        baseInfection_1.BaseInfectionPerk.createFromValues(),
        contaiguous_1.ContaiguousPerk.createFromValues(),
        deadlyEnvironment_1.DeadlyEnvironmentPerk.createFromValues(),
    ],
};
