"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../skilltree/events");
var perk_1 = require("../skilltree/perks/perk");
var entites_1 = require("./entites");
var basicMechanics_1 = __importDefault(require("./mechanics/basicMechanics"));
var bounceMechanics_1 = __importDefault(require("./mechanics/bounceMechanics"));
var conquerCell_1 = require("./mechanics/events/conquerCell");
var defendCell_1 = require("./mechanics/events/defendCell");
var fight_1 = require("./mechanics/events/fight");
var growth_1 = require("./mechanics/events/growth");
var move_1 = require("./mechanics/events/move");
var raiseEvent_1 = require("./mechanics/events/raiseEvent");
var sendUnits_1 = require("./mechanics/events/sendUnits");
var startGame_1 = require("./mechanics/events/startGame");
var stolenPerk_1 = require("./mechanics/events/stolenPerk");
var visualizeBubbleProps_1 = require("./mechanics/events/visualizeBubbleProps");
var visualizeCellProps_1 = require("./mechanics/events/visualizeCellProps");
var scrapeOffMechanics_1 = __importDefault(require("./mechanics/scrapeOffMechanics"));
var player_1 = require("./player");
var getMechanics = function (settings) {
    if (settings.mechanics === "basic") {
        return basicMechanics_1.default;
    }
    else if (settings.mechanics === "scrapeoff") {
        return scrapeOffMechanics_1.default;
    }
    else if (settings.mechanics === "bounce") {
        return bounceMechanics_1.default;
    }
    else
        throw Error("unregistered mechanics");
};
var SpreadGameImplementation = /** @class */ (function () {
    function SpreadGameImplementation(map, gameSettings, players, perks) {
        //const players = getPlayerIds(map);
        this.gameSettings = gameSettings;
        this.mechanics = getMechanics(gameSettings);
        this.map = map;
        this.cells = map.cells.map(function (mapCell) {
            var cell = {
                id: mapCell.id,
                playerId: mapCell.playerId,
                position: mapCell.position,
                radius: mapCell.radius,
                units: mapCell.units,
            };
            return cell;
        });
        this.bubbles = [];
        this.players = players;
        this.timePassed = 0;
        this.pastMoves = [];
        this.eventHistory = [];
        this.perks = perks === undefined ? perk_1.allPerks : perks;
        this.attachedProps = [];
        this.triggerStart();
    }
    SpreadGameImplementation.prototype.triggerStart = function () {
        var _this = this;
        var startEvent = {
            type: "StartGame",
        };
        var props = this.handleEvent(startEvent);
        this.cells = this.cells.map(function (cell) {
            var attProps = _this.fromAttachedProps({
                type: "Cell",
                id: cell.id,
            });
            var startCellProps = startGame_1.startGameCellUtils.collect(attProps.concat(props));
            return __assign(__assign({}, cell), { units: cell.units + startCellProps.additionalUnits });
        });
    };
    SpreadGameImplementation.fromReplay = function (replay) {
        var perks = replay.perks
            .map(function (data) { return perk_1.perkFromBackUp(data); })
            .filter(function (p) { return p !== null; });
        var spreadGame = new SpreadGameImplementation(replay.map, replay.gameSettings, replay.players.map(player_1.playerFromData), perks);
        return spreadGame;
    };
    SpreadGameImplementation.prototype.attachProps = function (props) {
        var _this = this;
        var res = props.flatMap(function (prop) {
            var existingIndex = _this.attachedProps.findIndex(function (ap) {
                var _a, _b, _c, _d;
                return ap.perkName === prop.perkName &&
                    ap.props.value.type === prop.props.value.type &&
                    ap.triggerType === prop.triggerType &&
                    ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === ((_b = prop.entity) === null || _b === void 0 ? void 0 : _b.type) &&
                    ((_c = ap.entity) === null || _c === void 0 ? void 0 : _c.id) === ((_d = prop.entity) === null || _d === void 0 ? void 0 : _d.id);
            });
            if (existingIndex >= 0) {
                _this.attachedProps[existingIndex] = prop;
                return [];
            }
            else if (prop.entity !== null) {
                _this.attachedProps.push(prop);
                return [];
            }
            else {
                return [prop.props.value];
            }
        });
        return res;
    };
    // attaches every prop that is supposed to be attached
    // and returns all other props
    SpreadGameImplementation.prototype.handleEvent = function (event) {
        var _this = this;
        var props = this.perks.flatMap(function (perk) {
            return perk.triggers.flatMap(function (tr) {
                if (tr.type === "StartGame" && event.type === "StartGame") {
                    return tr.getValue(event, _this);
                }
                else if (raiseEvent_1.isRaisableEffect(tr) && raiseEvent_1.isRaisableEvent(event)) {
                    return tr.getValue(event, _this);
                }
                else if (tr.type === "TimeStep" &&
                    event.type === "TimeStep") {
                    return tr.getValue(event, _this);
                }
                else if (tr.type === "Growth" && event.type === "Growth") {
                    return tr.getValue(event, _this);
                }
                else if (tr.type === "Move" && event.type === "Move") {
                    return tr.getValue(event, _this);
                }
                else if (tr.type === "ConquerCell" &&
                    event.type === "ConquerCell")
                    return tr.getValue(event, _this);
                else if (tr.type === "DefendCell" &&
                    event.type === "DefendCell")
                    return tr.getValue(event, _this);
                else if (tr.type === "SendUnits" && event.type === "SendUnits")
                    return tr.getValue(event, _this);
                else if (tr.type === "BeforeFightEvent" &&
                    event.type === "BeforeFightEvent")
                    return tr.getValue(event, _this);
                else if (tr.type === "CreateBubble" &&
                    event.type == "CreateBubble") {
                    return tr.getValue(event, _this);
                }
                else
                    return [];
            });
        });
        var remProps = this.attachProps(props);
        remProps
            .filter(function (prop) { return prop.type === "RaiseEvent"; })
            .map(function (raiseProp) { return _this.handleEvent(raiseProp.event); });
        if (event.type === "DefendCell") {
            var fromAttachedProps = this.fromAttachedProps({
                type: "Cell",
                id: event.after.cell.id,
            });
            var defendProps = defendCell_1.defendCellUtils.collect(fromAttachedProps.concat(remProps));
            var index = this.cells.findIndex(function (c) { return c.id === event.after.cell.id; });
            if (index < 0)
                throw new Error("Cell not found");
            this.cells[index] = __assign(__assign({}, this.cells[index]), { units: this.cells[index].units + defendProps.additionalUnits });
        }
        else if (event.type === "ConquerCell") {
            var fromAttachedProps = this.fromAttachedProps({
                type: "Cell",
                id: event.after.cell.id,
            });
            var conquerProps = conquerCell_1.conquerCellUtils.collect(fromAttachedProps.concat(remProps));
            var index = this.cells.findIndex(function (c) { return c.id === event.after.cell.id; });
            if (index < 0)
                throw new Error("Cell not found");
            this.cells[index] = __assign(__assign({}, this.cells[index]), { units: this.cells[index].units *
                    conquerProps.unitsInPercentToRemain +
                    conquerProps.additionalUnits });
        }
        return remProps;
    };
    SpreadGameImplementation.prototype.runReplay = function (replay, ms) {
        var _this = this;
        var movesToDo = replay.moveHistory.filter(function (mv) {
            return mv.timestamp >= _this.timePassed &&
                mv.timestamp < _this.timePassed + ms;
        });
        var finalTime = Math.min(this.timePassed + ms, replay.lengthInMs);
        while (this.timePassed < finalTime) {
            movesToDo.forEach(function (mv) {
                if (mv.timestamp === _this.timePassed) {
                    _this.applyMove(mv.data);
                }
            });
            this.step(replay.gameSettings.updateFrequencyInMs);
        }
    };
    SpreadGameImplementation.prototype.getReplay = function () {
        var rep = {
            map: this.map,
            gameSettings: this.gameSettings,
            moveHistory: this.pastMoves,
            players: this.players.map(function (pl) { return player_1.dataFromPlayer(pl); }),
            lengthInMs: this.timePassed,
            perks: this.perks.map(function (p) { return perk_1.backupFromPerk(p); }),
        };
        return rep;
    };
    SpreadGameImplementation.prototype.applyMove = function (move) {
        if (move.type === "sendunitsmove") {
            this.sendUnits(move.data.playerId, move.data.senderIds, move.data.receiverId);
        }
    };
    SpreadGameImplementation.prototype.run = function (ms, updateFrequencyInMs) {
        if (ms <= 0)
            return;
        else {
            this.step(updateFrequencyInMs);
            this.run(ms - updateFrequencyInMs, updateFrequencyInMs);
        }
    };
    SpreadGameImplementation.prototype.step = function (ms) {
        var _this = this;
        var stepEvent = {
            type: "TimeStep",
            ms: ms,
        };
        this.handleEvent(stepEvent);
        this.bubbles = this.bubbles.map(function (bubble) {
            var moveEvent = {
                type: "Move",
                bubble: bubble,
            };
            var props = _this.handleEvent(moveEvent);
            var moveProps = move_1.moveUtils.collect(_this.fromAttachedProps({
                type: "Bubble",
                id: bubble.id,
            }).concat(props));
            return _this.mechanics.move(bubble, ms, moveProps);
        });
        this.cells = this.cells.map(function (cell) {
            var growthEvent = {
                type: "Growth",
                cell: cell,
            };
            var props = _this.handleEvent(growthEvent);
            var growthProps = growth_1.growthUtils.collect(_this.fromAttachedProps({ type: "Cell", id: cell.id }).concat(props));
            return _this.mechanics.grow(cell, ms, growthProps);
        });
        this.collideBubblesWithCells();
        this.collideBubblesWithBubbles();
        this.checkForFinishedFights();
        this.timePassed += ms;
    };
    SpreadGameImplementation.prototype.collideBubblesWithBubbles = function () {
        var _this = this;
        var fightResults = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var currentBubble = bubble;
            remainingBubbles = remainingBubbles.map(function (bubble2) {
                if (currentBubble !== null &&
                    bubble2 !== null &&
                    _this.mechanics.collidesWithBubble(bubble2, currentBubble)) {
                    var beforeFight = {
                        attacker: __assign({}, bubble2),
                        defender: { type: "Bubble", val: __assign({}, currentBubble) },
                    };
                    var beforeEvent = {
                        type: "BeforeFightEvent",
                        before: beforeFight,
                    };
                    var props = _this.handleEvent(beforeEvent);
                    var bubbleFightProps = fight_1.bubbleFightUtils.collect(_this.fromAttachedProps({
                        type: "Bubble",
                        id: currentBubble.id,
                    }).concat(props));
                    var bubble2FightProps = fight_1.bubbleFightUtils.collect(_this.fromAttachedProps({
                        type: "Bubble",
                        id: bubble2.id,
                    }).concat(props));
                    var _a = _this.mechanics.collideBubble(bubble2, currentBubble, bubble2FightProps, bubbleFightProps), rem1 = _a[0], rem2 = _a[1];
                    var afterFight = {
                        attacker: rem1,
                        defender: { type: "Bubble", val: rem2 },
                    };
                    fightResults.push([beforeFight, afterFight]);
                    currentBubble = rem2;
                    return rem1;
                }
                else {
                    return bubble2;
                }
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles.filter(function (b) { return b !== null; });
        fightResults.forEach(function (_a) {
            var before = _a[0], after = _a[1];
            return _this.processFight(before, after);
        });
    };
    SpreadGameImplementation.prototype.checkForFinishedFights = function () {
        var _this = this;
        this.eventHistory = this.eventHistory.map(function (ev) {
            if (ev.data.type === "FightEvent" && !ev.data.finished) {
                var returnEvent = __assign({}, ev.data);
                var eventData_1 = ev.data;
                var currentAttacker = _this.bubbles.find(function (b) { return b.id === eventData_1.before.attacker.id; });
                var currentDefender = eventData_1.before.defender.type === "Cell"
                    ? _this.cells.find(function (c) { return c.id === eventData_1.before.defender.val.id; })
                    : _this.bubbles.find(function (b) { return b.id === eventData_1.before.defender.val.id; });
                if (currentAttacker === undefined ||
                    currentDefender === undefined) {
                    // attacker or defender got killed by someone else
                    events_1.finishFightEvent(returnEvent);
                }
                else if (events_1.latestDistance(eventData_1) <
                    entites_1.distance(currentAttacker.position, currentDefender.position)) {
                    // they are moving away from each other
                    events_1.finishFightEvent(returnEvent);
                }
                return __assign(__assign({}, ev), { data: returnEvent });
            }
            else
                return ev;
        });
    };
    // this either adds a FightEvent or a PartialFightEvent or modifies a PartialFightEvent in the event history
    SpreadGameImplementation.prototype.processFight = function (before, after) {
        var _this = this;
        var _a;
        var capturedCellEvent = before.defender.type === "Cell" &&
            after.defender.val !== null &&
            after.defender.val.playerId !== null &&
            before.defender.val.playerId !== after.defender.val.playerId
            ? {
                afterPlayerId: after.defender.val.playerId,
                beforePlayerId: before.defender.val.playerId,
                cellId: before.defender.val.id,
                type: "CapturedCell",
            }
            : null;
        var defeatedBubbleEvents = [];
        if (after.attacker === null) {
            defeatedBubbleEvents.push({
                type: "DefeatedBubble",
                defender: after.defender,
            });
        }
        if (after.defender.type === "Bubble" && after.defender.val === null) {
            defeatedBubbleEvents.push({
                type: "DefeatedBubble",
                defender: { type: "Bubble", val: after.attacker },
            });
        }
        var existingPartialFightEvent = (_a = this.eventHistory.find(function (ev) {
            return ev.data.type === "FightEvent" &&
                !ev.data.finished &&
                ev.data.before.attacker.id === before.attacker.id &&
                ev.data.before.defender.type === before.defender.type &&
                ev.data.before.defender.val.id === before.defender.val.id;
        })) === null || _a === void 0 ? void 0 : _a.data;
        if (existingPartialFightEvent !== undefined &&
            events_1.combinedFightEvents(existingPartialFightEvent, before, after, this.timePassed)) {
        }
        else {
            var newEvent = events_1.createFightEvent(before, after, this.timePassed);
            this.eventHistory.push({
                timestamp: this.timePassed,
                data: newEvent,
            });
        }
        if (capturedCellEvent !== null)
            this.eventHistory.push({
                timestamp: this.timePassed,
                data: capturedCellEvent,
            });
        defeatedBubbleEvents.forEach(function (ev) {
            return _this.eventHistory.push({ timestamp: _this.timePassed, data: ev });
        });
    };
    SpreadGameImplementation.prototype.collideBubblesWithCells = function () {
        var _this = this;
        var fightResults = [];
        var eventsToProcess = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var currentBubble = bubble;
            _this.cells = _this.cells.map(function (cell) {
                if (currentBubble != null &&
                    (currentBubble.motherId !== cell.id ||
                        currentBubble.playerId !== cell.playerId) &&
                    _this.mechanics.collidesWithCell(bubble, cell)) {
                    var beforeFight = {
                        attacker: __assign({}, currentBubble),
                        defender: { type: "Cell", val: __assign({}, cell) },
                    };
                    var beforeEvent = {
                        type: "BeforeFightEvent",
                        before: beforeFight,
                    };
                    var props = _this.handleEvent(beforeEvent);
                    var bubbleFightProps = fight_1.bubbleFightUtils.collect(_this.fromAttachedProps({
                        type: "Bubble",
                        id: currentBubble.id,
                    }).concat(props));
                    var cellFightProps = fight_1.cellFightUtils.collect(_this.fromAttachedProps({
                        type: "Cell",
                        id: cell.id,
                    }).concat(props));
                    var _a = _this.mechanics.collideCell(currentBubble, cell, bubbleFightProps, cellFightProps), newCurrentBubble = _a[0], newCell = _a[1];
                    var afterFight = {
                        attacker: newCurrentBubble !== null
                            ? __assign({}, newCurrentBubble) : null,
                        defender: { type: "Cell", val: __assign({}, newCell) },
                    };
                    fightResults.push([beforeFight, afterFight]);
                    if (newCell.playerId !== cell.playerId) {
                        var conquerEvent = {
                            type: "ConquerCell",
                            before: { cell: __assign({}, cell) },
                            after: { cell: __assign({}, newCell) },
                        };
                        eventsToProcess.push(conquerEvent);
                    }
                    else {
                        /* if (newCell.playerId === cell.playerId) { */
                        var defendEvent = {
                            type: "DefendCell",
                            before: { cell: __assign({}, cell) },
                            after: { cell: __assign({}, newCell) },
                        };
                        eventsToProcess.push(defendEvent);
                    }
                    currentBubble = newCurrentBubble;
                    //if (event !== null) eventsToAdd.push(event);
                    return newCell;
                }
                else {
                    return cell;
                }
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles;
        fightResults.forEach(function (_a) {
            var before = _a[0], after = _a[1];
            return _this.processFight(before, after);
        });
        eventsToProcess.forEach(function (ev) { return _this.handleEvent(ev); });
    };
    SpreadGameImplementation.prototype.fromAttachedProps = function (entity) {
        var _this = this;
        var result = this.attachedProps
            .filter(function (prop) {
            var _a;
            return (prop.props.expirationInMs === "Never" ||
                prop.props.expirationInMs >= _this.timePassed) &&
                ((_a = prop.entity) === null || _a === void 0 ? void 0 : _a.type) === entity.type &&
                prop.entity.id === entity.id;
        })
            .map(function (prop) { return prop.props.value; });
        return result;
    };
    SpreadGameImplementation.prototype.sendUnits = function (playerId, senderIds, receiverId) {
        var _this = this;
        var eventsToAdd = [];
        var player = this.players.find(function (p) { return p.id == playerId; });
        if (player == undefined)
            return false;
        var targetCell = this.cells.find(function (c) { return c.id == receiverId; });
        if (targetCell == undefined)
            return false;
        var sentIds = [];
        this.cells = this.cells.map(function (sender) {
            if (senderIds.some(function (id) { return id === sender.id; }) &&
                sender.playerId === playerId &&
                sender.id !== receiverId) {
                var event_1 = {
                    sender: sender,
                    target: targetCell,
                    type: "SendUnits",
                };
                var unsavedProps = _this.handleEvent(event_1);
                var fromAttachedProps = _this.fromAttachedProps({
                    type: "Cell",
                    id: sender.id,
                });
                var sendUnitsProps = sendUnits_1.sendUnitsUtils.collect(fromAttachedProps.concat(unsavedProps));
                var _a = _this.mechanics.sendBubble(sender, targetCell, _this.timePassed, sendUnitsProps), remCell = _a[0], bubble = _a[1];
                if (bubble !== null) {
                    var createBubbleEvent = {
                        sendUnitsEvent: event_1,
                        after: { bubble: bubble, sender: remCell },
                        type: "CreateBubble",
                    };
                    _this.handleEvent(createBubbleEvent);
                    _this.bubbles.push(bubble);
                    eventsToAdd.push({
                        type: "SendBubbleEvent",
                        sender: sender,
                        receiver: targetCell,
                    });
                    sentIds.push(sender.id);
                }
                return remCell;
            }
            else {
                return sender;
            }
        });
        this.pastMoves.push({
            timestamp: this.timePassed,
            data: {
                type: "sendunitsmove",
                data: {
                    receiverId: targetCell.id,
                    senderIds: sentIds,
                    playerId: playerId,
                },
            },
        });
        this.eventHistory = this.eventHistory.concat(eventsToAdd.map(function (ev) {
            return { timestamp: _this.timePassed, data: ev };
        }));
    };
    SpreadGameImplementation.prototype.getSkilledPerk = function (perkName, playerId) {
        var perk = this.getSkilledPerks(playerId).find(function (p) { return p.perk.name === perkName; });
        return perk !== undefined ? perk : null;
    };
    SpreadGameImplementation.prototype.toClientGameState = function (playerId) {
        var _this = this;
        if (playerId === void 0) { playerId = null; }
        var gs = {
            timePassedInMs: this.timePassed,
            cells: this.cells.map(function (cell) {
                var cellProps = visualizeCellProps_1.visualizeCellUtils.collect(_this.fromAttachedProps({ type: "Cell", id: cell.id }));
                var hideProps = playerId !== null
                    ? cellProps.hideProps.get(playerId)
                    : undefined;
                var cellData = hideProps === undefined || hideProps.showUnits
                    ? {
                        attackerCombatAbilities: cellProps.rageValue,
                        defenderCombatAbilities: cellProps.combatAbilityModifier,
                        membraneValue: cellProps.membraneAbsorption,
                        units: cell.units,
                    }
                    : null;
                return {
                    id: cell.id,
                    playerId: cell.playerId,
                    position: cell.position,
                    radius: cell.radius,
                    data: cellData,
                };
            }),
            bubbles: this.bubbles.map(function (bubble) {
                var bubbleProps = visualizeBubbleProps_1.visualizeBubbleUtils.collect(_this.fromAttachedProps({ type: "Bubble", id: bubble.id }));
                var hideProps = playerId !== null
                    ? bubbleProps.hideProps.get(playerId)
                    : undefined;
                var bubbleData = hideProps === undefined || !hideProps.invisible
                    ? {
                        attackCombatAbilities: bubbleProps.combatAbilityModifier,
                        position: bubble.position,
                        radius: bubble.radius,
                        units: bubble.units,
                    }
                    : null;
                return {
                    id: bubble.id,
                    playerId: bubble.playerId,
                    data: bubbleData,
                };
            }),
        };
        return gs;
    };
    SpreadGameImplementation.prototype.getSkilledPerks = function (playerId) {
        var pl = this.players.find(function (pl) { return pl.id === playerId; });
        if (pl === undefined)
            return [];
        var stolenPerks = stolenPerk_1.stolenPerksUtils.collect(this.fromAttachedProps({ type: "Player", id: pl.id }));
        return pl.skills.concat(stolenPerks.skilledPerks);
    };
    return SpreadGameImplementation;
}());
exports.SpreadGameImplementation = SpreadGameImplementation;
