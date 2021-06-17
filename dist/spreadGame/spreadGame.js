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
var entites_1 = require("./entites");
var cellGrowth_1 = require("./gameProps/cellGrowth");
var basicMechanics_1 = __importDefault(require("./mechanics/basicMechanics"));
var bounceMechanics_1 = __importDefault(require("./mechanics/bounceMechanics"));
var conquerCell_1 = require("./mechanics/events/conquerCell");
var defendCell_1 = require("./mechanics/events/defendCell");
var fight_1 = require("./mechanics/events/fight");
var sendUnits_1 = require("./mechanics/events/sendUnits");
var visualizeCellProps_1 = require("./mechanics/events/visualizeCellProps");
var scrapeOffMechanics_1 = __importDefault(require("./mechanics/scrapeOffMechanics"));
var perk_1 = require("./perks/perk");
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
        this.cells = this.cells.map(function (cell) {
            var perks = cell.playerId !== null
                ? _this.getSkilledPerks(cell.playerId)
                : [];
            /*             const defStartProps: DefenderStartProps = defenderStartUtils.collect(
                perks,
                {},
                this
            ); */
            /*             return {
                ...cell,
                units: cell.units + defStartProps.additionalUnits,
            }; */
            return cell;
        });
    };
    SpreadGameImplementation.fromReplay = function (replay) {
        var perks = replay.perks
            .map(perk_1.perkFromBackUp)
            .filter(function (p) { return p !== null; });
        var spreadGame = new SpreadGameImplementation(replay.map, replay.gameSettings, replay.players.map(player_1.playerFromData), perks);
        return spreadGame;
    };
    SpreadGameImplementation.prototype.attachProps = function (props) {
        var _this = this;
        props.forEach(function (prop) {
            var existingIndex = _this.attachedProps.findIndex(function (ap) {
                var _a, _b, _c, _d;
                return ap.perkName === prop.perkName &&
                    ap.props.value.type === prop.props.value.type &&
                    ap.triggerType === prop.triggerType &&
                    ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === ((_b = prop.entity) === null || _b === void 0 ? void 0 : _b.type) &&
                    ((_c = ap.entity) === null || _c === void 0 ? void 0 : _c.id) === ((_d = prop.entity) === null || _d === void 0 ? void 0 : _d.id);
            });
            if (existingIndex >= 0)
                _this.attachedProps[existingIndex] = prop;
            else if (prop.entity !== null) {
                _this.attachedProps.push(prop);
            }
        });
    };
    // attaches every prop that is supposed to be attached
    // and returns all other props
    SpreadGameImplementation.prototype.handleEvent = function (event) {
        var _this = this;
        var props = this.perks.flatMap(function (perk) {
            return perk.triggers
                .flatMap(function (tr) {
                if (tr.type === "ConquerCell" &&
                    event.type === "ConquerCell")
                    return tr.getValue(event, _this);
                else if (tr.type === "SendUnits" &&
                    event.type === "SendUnits")
                    return tr.getValue(event, _this);
                else if (tr.type === "CreateBubble" &&
                    event.type == "CreateBubble") {
                    return tr.getValue(event, _this);
                }
                else
                    return null;
            })
                .filter(function (p) {
                return p !== null;
            });
        });
        this.attachProps(props);
        var result = props
            .filter(function (props) { return props.entity === null; })
            .map(function (prop) { return prop.props.value; });
        return result;
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
        this.bubbles = this.bubbles.map(function (bubble) {
            return _this.mechanics.move(bubble, ms);
        });
        this.cells = this.cells.map(function (cell) {
            var growthProps = cellGrowth_1.growthUtils.default;
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
            var skills1 = _this.getSkilledPerks(bubble.playerId);
            var currentBubble = bubble;
            remainingBubbles = remainingBubbles.map(function (bubble2) {
                if (currentBubble !== null &&
                    bubble2 !== null &&
                    _this.mechanics.collidesWithBubble(bubble2, currentBubble)) {
                    var bubbleFightProps = fight_1.bubbleFightUtils.collect(_this.attachedProps
                        .filter(function (ap) {
                        var _a;
                        return ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Bubble" &&
                            ap.entity.id === (currentBubble === null || currentBubble === void 0 ? void 0 : currentBubble.id);
                    })
                        .map(function (prop) { return prop.props.value; }));
                    var bubble2FightProps = fight_1.bubbleFightUtils.collect(_this.attachedProps
                        .filter(function (ap) {
                        var _a;
                        return ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Bubble" &&
                            ap.entity.id === bubble2.id;
                    })
                        .map(function (prop) { return prop.props.value; }));
                    var _a = _this.mechanics.collideBubble(bubble2, currentBubble, bubble2FightProps, bubbleFightProps), rem1 = _a[0], rem2 = _a[1];
                    fightResults.push([
                        {
                            attacker: bubble2,
                            defender: { type: "Bubble", val: currentBubble },
                        },
                        {
                            attacker: rem1,
                            defender: { type: "Bubble", val: rem2 },
                        },
                    ]);
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
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var skills1 = _this.getSkilledPerks(bubble.playerId);
            var currentBubble = bubble;
            _this.cells = _this.cells.map(function (cell) {
                if (currentBubble != null &&
                    (currentBubble.motherId !== cell.id ||
                        currentBubble.playerId !== cell.playerId) &&
                    _this.mechanics.collidesWithCell(bubble, cell)) {
                    var bubbleFightProps = fight_1.bubbleFightUtils.collect(_this.attachedProps
                        .filter(function (ap) {
                        var _a;
                        return ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Bubble" &&
                            ap.entity.id === (currentBubble === null || currentBubble === void 0 ? void 0 : currentBubble.id);
                    })
                        .map(function (prop) { return prop.props.value; }));
                    var cellFightProps = fight_1.cellFightUtils.collect(_this.attachedProps
                        .filter(function (ap) {
                        var _a;
                        return ((_a = ap.entity) === null || _a === void 0 ? void 0 : _a.type) === "Cell" &&
                            ap.entity.id === cell.id;
                    })
                        .map(function (prop) { return prop.props.value; }));
                    var _a = _this.mechanics.collideCell(currentBubble, cell, bubbleFightProps, cellFightProps), newCurrentBubble = _a[0], newCell = _a[1];
                    fightResults.push([
                        {
                            attacker: currentBubble,
                            defender: { type: "Cell", val: cell },
                        },
                        {
                            attacker: newCurrentBubble,
                            defender: { type: "Cell", val: newCell },
                        },
                    ]);
                    if (newCell.playerId !== cell.playerId) {
                        var conquerEvent = {
                            type: "ConquerCell",
                            before: { cell: __assign({}, cell) },
                            after: { cell: __assign({}, newCell) },
                        };
                        var props = _this.handleEvent(conquerEvent);
                        var allProps = _this.allProps(props);
                        var conquerProps = conquerCell_1.conquerCellUtils.collect(allProps);
                        newCell = __assign(__assign({}, newCell), { units: newCell.units + conquerProps.additionalUnits });
                    }
                    else {
                        /* if (newCell.playerId === cell.playerId) { */
                        var defendEvent = {
                            type: "DefendCell",
                            before: { cell: __assign({}, cell) },
                            after: { cell: __assign({}, newCell) },
                        };
                        var props = _this.handleEvent(defendEvent);
                        var allProps = _this.allProps(props);
                        var conquerProps = defendCell_1.defendCellUtils.collect(allProps);
                        newCell = __assign(__assign({}, newCell), { units: newCell.units + conquerProps.additionalUnits });
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
    };
    SpreadGameImplementation.prototype.allProps = function (props) {
        var _this = this;
        var result = this.attachedProps
            .filter(function (prop) {
            return prop.props.expirationInMs === "Never" ||
                prop.props.expirationInMs >= _this.timePassed;
        })
            .map(function (prop) { return prop.props.value; });
        return result.concat(props);
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
                var allProps = _this.allProps(unsavedProps);
                var sendUnitsProps = sendUnits_1.sendUnitsUtils.collect(allProps);
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
        var st = this.players.find(function (pl) { return pl.id === playerId; });
        var perk = st === null || st === void 0 ? void 0 : st.skills.find(function (p) { return p.perk.name === perkName; });
        return perk !== undefined ? perk : null;
    };
    SpreadGameImplementation.prototype.toClientGameState = function () {
        var _this = this;
        var gs = {
            timePassedInMs: this.timePassed,
            cells: this.cells.map(function (cell) {
                var cellProps = visualizeCellProps_1.visualizeCellUtils.collect(_this.allProps([]));
                return {
                    id: cell.id,
                    playerId: cell.playerId,
                    units: cell.units,
                    position: cell.position,
                    radius: cell.radius,
                    defenderCombatAbilities: cellProps.combatAbilityModifier,
                };
            }),
            bubbles: this.bubbles.map(function (bubble) {
                var bubbleProps = visualizeCellProps_1.visualizeCellUtils.collect(_this.allProps([]));
                return {
                    id: bubble.id,
                    playerId: bubble.playerId,
                    units: bubble.units,
                    position: bubble.position,
                    radius: bubble.radius,
                    attackCombatAbilities: bubbleProps.combatAbilityModifier,
                };
            }),
        };
        return gs;
    };
    SpreadGameImplementation.prototype.getSkilledPerks = function (playerId) {
        var pl = this.players.find(function (pl) { return pl.id === playerId; });
        if (pl === undefined)
            return [];
        else
            return pl.skills;
    };
    return SpreadGameImplementation;
}());
exports.SpreadGameImplementation = SpreadGameImplementation;
