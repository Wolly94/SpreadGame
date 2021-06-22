"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cellHideUtils = {
    combine: function (a, b) {
        return {
            showUnits: a.showUnits && b.showUnits,
        };
    },
    default: { showUnits: true },
};
var combinePlayerCellHideProps = function (a, b) {
    var res = new Map();
    Array.from(a.entries()).forEach(function (entry) {
        var key = entry[0], value = entry[1];
        var exVal = res.get(key);
        res.set(key, exports.cellHideUtils.combine(exVal === undefined ? exports.cellHideUtils.default : exVal, value));
    });
    Array.from(b.entries()).forEach(function (entry) {
        var key = entry[0], value = entry[1];
        var exVal = res.get(key);
        res.set(key, exports.cellHideUtils.combine(exVal === undefined ? exports.cellHideUtils.default : exVal, value));
    });
    return res;
};
var type = "VisualizeCellProps";
exports.visualizeCellUtils = {
    combine: function (a, b) {
        return {
            type: type,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            rageValue: a.rageValue + b.rageValue,
            membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
            hideProps: combinePlayerCellHideProps(a.hideProps, b.hideProps),
            infected: a.infected || b.infected,
        };
    },
    default: {
        type: type,
        combatAbilityModifier: 0,
        rageValue: 0,
        membraneAbsorption: 0,
        hideProps: new Map(),
        infected: false,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.visualizeCellUtils.combine(prev, curr);
            else
                return prev;
        }, exports.visualizeCellUtils.default);
    },
};
