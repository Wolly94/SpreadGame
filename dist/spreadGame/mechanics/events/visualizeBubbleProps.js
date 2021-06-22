"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bubbleHideUtils = {
    combine: function (a, b) {
        return {
            invisible: a.invisible || b.invisible,
        };
    },
    default: { invisible: false },
};
var combinePlayerBubbleHideProps = function (a, b) {
    var res = new Map();
    Array.from(a.entries()).forEach(function (entry) {
        var key = entry[0], value = entry[1];
        var exVal = res.get(key);
        res.set(key, exports.bubbleHideUtils.combine(exVal === undefined ? exports.bubbleHideUtils.default : exVal, value));
    });
    Array.from(b.entries()).forEach(function (entry) {
        var key = entry[0], value = entry[1];
        var exVal = res.get(key);
        res.set(key, exports.bubbleHideUtils.combine(exVal === undefined ? exports.bubbleHideUtils.default : exVal, value));
    });
    return res;
};
var type = "VisualizeBubbleProps";
exports.visualizeBubbleUtils = {
    combine: function (a, b) {
        return {
            type: type,
            combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
            hideProps: combinePlayerBubbleHideProps(a.hideProps, b.hideProps),
            infected: a.infected || b.infected,
        };
    },
    default: {
        type: type,
        combatAbilityModifier: 0,
        hideProps: new Map(),
        infected: false,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.visualizeBubbleUtils.combine(prev, curr);
            else
                return prev;
        }, exports.visualizeBubbleUtils.default);
    },
};
