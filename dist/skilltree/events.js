"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entites_1 = require("../spreadGame/entites");
var fromCollisionStates = function (before, after) {
    var attacker = {
        beforePlayerId: before.bubble.playerId,
        afterPlayerId: after.bubble === null ? null : after.bubble.playerId,
        position: before.bubble.position,
        unitsLost: before.bubble.units -
            (after.bubble !== null ? after.bubble.units : 0),
    };
    var defender = {
        beforePlayerId: before.other.val.playerId,
        afterPlayerId: after.other.val === null ? null : after.other.val.playerId,
        position: before.other.val.position,
        unitsLost: before.other.val.units -
            (after.other.val !== null ? after.other.val.units : 0),
    };
    return { bubble: attacker, other: defender };
};
exports.latestDistance = function (event) {
    var latestState = event.partialCollisions.slice(-1)[0].data;
    return entites_1.distance(latestState.bubble.position, latestState.other.position);
};
exports.collisionEventFinished = function (event) {
    return event.finished;
};
exports.finishCollisionEvent = function (event) {
    event.finished = true;
    return event;
};
exports.entitiesApproached = function (before, after) {
    var newDist = entites_1.distance(after.bubble.position, after.other.position);
    var latestDist = entites_1.distance(before.bubble.position, before.other.position);
    return latestDist > newDist;
};
exports.createCollisionEvent = function (beforeFight, afterFight, timePassed) {
    var partialFight = fromCollisionStates(beforeFight, afterFight);
    var finished = afterFight.bubble === null ||
        (afterFight.other.type === "Bubble" && afterFight.other.val === null);
    return {
        type: "CollisionEvent",
        partialCollisions: [{ timestamp: timePassed, data: partialFight }],
        after: afterFight,
        before: beforeFight,
        finished: finished,
    };
};
// either modifies FightEvent in place or creates a new one
exports.combinedCollisionEvents = function (collisionEvent, beforeCollision, afterCollision, timePassed) {
    var partialCollision = fromCollisionStates(beforeCollision, afterCollision);
    var latestState = collisionEvent.partialCollisions.slice(-1)[0].data;
    if (exports.entitiesApproached(latestState, partialCollision) &&
        !exports.collisionEventFinished(collisionEvent)) {
        collisionEvent.partialCollisions.push({
            timestamp: timePassed,
            data: partialCollision,
        });
        collisionEvent.after = afterCollision;
        if (afterCollision.bubble === null ||
            (afterCollision.other.type === "Bubble" &&
                afterCollision.other.val === null)) {
            exports.finishCollisionEvent(collisionEvent);
        }
        return true;
    }
    else {
        exports.finishCollisionEvent(collisionEvent);
        return false;
    }
};
exports.getCapturedCellEvent = function (beforeCollision, afterCollision) {
    if (beforeCollision.other.type === "Cell" &&
        afterCollision.other.type === "Cell" &&
        afterCollision.other.val.playerId !== null &&
        beforeCollision.other.val.playerId !== afterCollision.other.val.playerId) {
        return {
            afterPlayerId: afterCollision.other.val.playerId,
            beforePlayerId: beforeCollision.other.val.playerId,
            cellId: beforeCollision.other.val.id,
            type: "CapturedCell",
        };
    }
    else
        return null;
};
// After collision ended and bubble is defeated from this event and the owner of the cell after collision is
// not the same as the owner of the bubble, then there is an "DefendedCellEvent"
exports.getDefendedCellEvent = function (event) {
    if (!event.finished)
        return null;
    if (event.after.other.type !== "Cell")
        return null;
    if (event.after.bubble !== null)
        return null;
    var bubbleId = event.before.bubble.id;
    var cellId = event.before.other.val.id;
    var attackerPlayerId = event.before.bubble.playerId;
    var defenderPlayerId = event.after.other.val.playerId;
    if (defenderPlayerId === attackerPlayerId)
        return null;
    if (event.partialCollisions.length === 0)
        return null;
    var index = event.partialCollisions.length - 1;
    while (index >= 0 &&
        event.partialCollisions[index].data.other.beforePlayerId ===
            defenderPlayerId &&
        event.partialCollisions[index].data.other.afterPlayerId ===
            defenderPlayerId) {
        index -= 1;
    }
    var defenderPartialCollisions = event.partialCollisions.slice(index + 1);
    var unitsDefeated = defenderPartialCollisions.reduce(function (prev, curr) { return prev + curr.data.bubble.unitsLost; }, 0);
    if (defenderPartialCollisions.length === 0 || unitsDefeated === 0)
        return null;
    return {
        type: "DefendedCell",
        cellId: cellId,
        bubbleId: bubbleId,
        defenderPlayerId: defenderPlayerId,
        attackerPlayerId: attackerPlayerId,
        unitsDefeated: unitsDefeated,
        collisionEvent: event,
    };
};
exports.getReinforcedCellEvent = function (event) {
    if (!event.finished)
        return null;
    if (event.before.other.type !== "Cell")
        return null;
    if (event.after.bubble !== null)
        return null;
    var bubbleId = event.before.bubble.id;
    var cellId = event.before.other.val.id;
    var fromPlayerId = event.before.bubble.playerId;
    var reinforceCollisions = event.partialCollisions.filter(function (pc) {
        return pc.data.other.beforePlayerId === fromPlayerId &&
            pc.data.other.beforePlayerId === pc.data.other.afterPlayerId;
    });
    if (reinforceCollisions.length === 0)
        return null;
    var timestamp = reinforceCollisions.slice(-1)[0].timestamp;
    var transferredUnits = reinforceCollisions.reduce(function (prev, curr) { return prev + curr.data.bubble.unitsLost; }, 0);
    if (transferredUnits === 0)
        return null;
    return {
        type: "ReinforcedCell",
        bubbleId: bubbleId,
        cellId: cellId,
        playerId: fromPlayerId,
        unitsTransferred: transferredUnits,
        collisionEvent: event,
    };
};
exports.getDefeatedBubbleEvents = function (event) {
    if (!event.finished)
        return [];
    if (event.after.bubble !== null && event.after.other.val !== null)
        return [];
    var res = [0, 0];
    var _a = event.partialCollisions.reduce(function (prev, curr) {
        return [
            prev[0] + curr.data.bubble.unitsLost,
            prev[1] + curr.data.other.unitsLost,
        ];
    }, res), defUnits1 = _a[0], defUnits2 = _a[1];
    var defeatedBubbleEvents = [];
    var after = event.after;
    if (after.bubble === null) {
        defeatedBubbleEvents.push({
            type: "DefeatedBubble",
            defeaterPlayerId: event.before.other.val.playerId,
            unitsDefeated: defUnits1,
            other: after.other,
            collisionEvent: event,
        });
    }
    if (after.other.type === "Bubble" && after.other.val === null) {
        defeatedBubbleEvents.push({
            type: "DefeatedBubble",
            defeaterPlayerId: event.before.bubble.playerId,
            unitsDefeated: defUnits2,
            other: { type: "Bubble", val: after.bubble },
            collisionEvent: event,
        });
    }
    return defeatedBubbleEvents;
};
exports.processFinishedCollisionEvent = function (event) {
    if (!event.finished)
        return [];
    var reinf = exports.getReinforcedCellEvent(event);
    var defend = exports.getDefendedCellEvent(event);
    var defeat = exports.getDefeatedBubbleEvents(event);
    var result = [];
    if (reinf !== null)
        result.push(reinf);
    if (defend !== null)
        result.push(defend);
    return result.concat(defeat);
};
