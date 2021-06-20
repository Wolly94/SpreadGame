"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAttack_1 = require("./baseAttack");
var baseDefense_1 = require("./baseDefense");
var basePopulation_1 = require("./basePopulation");
var baseSpirit_1 = require("./baseSpirit");
var berserk_1 = require("./berserk");
var fertileGrounds_1 = require("./fertileGrounds");
var kamikaze_1 = require("./kamikaze");
var lootsOfVictory_1 = require("./lootsOfVictory");
var membrane_1 = require("./membrane");
var preparation_1 = require("./preparation");
var rage_1 = require("./rage");
var reinforcements_1 = require("./reinforcements");
var slavery_1 = require("./slavery");
exports.getPerkLevel = function (game, perkName, playerId) {
    var skPerk = game.getSkilledPerk(perkName, playerId);
    if (skPerk !== null)
        return skPerk.level;
    else
        return 0;
};
exports.getPerkValueHelper = function (level, values, defaultValue) {
    if (level <= 0)
        return defaultValue;
    else {
        var val = values[Math.min(level, values.length) - 1];
        return val;
    }
};
exports.getPerkValue = function (game, perkName, playerId, values, defaultValue) {
    var lvl = exports.getPerkLevel(game, perkName, playerId);
    var val = exports.getPerkValueHelper(lvl, values, defaultValue);
    return val;
};
exports.backupFromPerk = function (perk) {
    var v1 = perk.values[0];
    var values = perk.values;
    return {
        name: perk.name,
        data: typeof v1 === "number"
            ? { type: "number", val: values }
            : { type: "number_number", val: values },
    };
};
exports.allPerks = [
    //Attack
    baseAttack_1.BaseAttackPerk.createFromValues(),
    rage_1.RagePerk.createFromValues(),
    berserk_1.BerserkPerk.createFromValues(),
    slavery_1.SlaveryPerk.createFromValues(),
    //Defense
    baseDefense_1.BaseDefensePerk.createFromValues(),
    preparation_1.PreparationPerk.createFromValues(),
    lootsOfVictory_1.LootsOfVictoryPerk.createFromValues(),
    membrane_1.MembranePerk.createFromValues(),
    //Population
    basePopulation_1.BasePopulationPerk.createFromValues(),
    fertileGrounds_1.FertileGroundsPerk.createFromValues(),
    reinforcements_1.ReinforcementsPerk.createFromValues(),
    //Spirit
    baseSpirit_1.BaseSpiritPerk.createFromValues(),
    kamikaze_1.KamikazePerk.createFromValues(),
];
exports.numberPerkCreators = [
    baseAttack_1.BaseAttackPerk,
    slavery_1.SlaveryPerk,
    baseDefense_1.BaseDefensePerk,
    lootsOfVictory_1.LootsOfVictoryPerk,
    membrane_1.MembranePerk,
    basePopulation_1.BasePopulationPerk,
    fertileGrounds_1.FertileGroundsPerk,
    reinforcements_1.ReinforcementsPerk,
    baseSpirit_1.BaseSpiritPerk,
    kamikaze_1.KamikazePerk,
];
exports.listPerkCreators = [rage_1.RagePerk, berserk_1.BerserkPerk, preparation_1.PreparationPerk];
exports.getPerkReplay = function (perk) {
    var ex = exports.numberPerkCreators.find(function (pk) { return pk.name === perk.name; });
    if (ex === undefined) {
        ex = exports.listPerkCreators.find(function (pk) { return pk.name; });
    }
    if (ex !== undefined)
        return ex.replay;
    else
        return null;
};
exports.perkFromBackUp = function (data) {
    var d = data.data;
    if (d.type === "number") {
        var perk = exports.numberPerkCreators.find(function (p) { return p.name === data.name; });
        if (perk === undefined)
            return null;
        else
            return perk.createFromValues(d.val);
    }
    else {
        var perk = exports.listPerkCreators.find(function (p) { return p.name === data.name; });
        if (perk === undefined)
            return null;
        else
            return perk.createFromValues(d.val);
    }
};
