"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAttack_1 = require("./baseAttack");
var rage_1 = require("./rage");
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
exports.allPerks = [
    baseAttack_1.BaseAttackPerk.createFromValues(),
    rage_1.RagePerk.createFromValues(),
];
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
exports.numberPerkCreators = [baseAttack_1.BaseAttackPerk];
exports.listPerkCreators = [rage_1.RagePerk];
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
