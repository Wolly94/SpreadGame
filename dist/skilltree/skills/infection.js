"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseInfection_1 = require("../perks/baseInfection");
var deadlyEnvironment_1 = require("../perks/deadlyEnvironment");
exports.Infection = {
    name: "Infection",
    perks: [
        baseInfection_1.BaseInfectionPerk.createFromValues(),
        deadlyEnvironment_1.DeadlyEnvironmentPerk.createFromValues(),
    ],
};
