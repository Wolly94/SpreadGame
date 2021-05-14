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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var entites_1 = require("../entites");
// adjusts recoverable values
var isMapCell = function (cell) {
    if (cell.playerId && typeof cell.playerId !== "number")
        cell.playerId = null; // return false
    if (typeof cell.units !== "number")
        cell.units = 0; // return false
    if (typeof cell.radius !== "number")
        cell.radius = exports.mapDefaults.minRadius; // return false
    if (!Array.isArray(cell.position) || !(cell.position.length === 2))
        return false;
    if (typeof cell.position[0] !== "number" ||
        typeof cell.position[1] !== "number")
        return false;
    return true;
};
exports.mapDefaults = {
    minRadius: 15,
    width: 1000,
    height: 1000,
    maxPlayers: 4,
};
exports.distanceToBoundary = function (map, position) {
    return Math.min(position[0], position[1], map.width - position[0], map.height - position[1]);
};
var distanceToCells = function (cells, position) {
    return Math.min.apply(Math, cells.map(function (c) { return entites_1.distanceToEntity(c, position); }));
};
exports.availableSpaceFromPosition = function (map, position) {
    return Math.min(exports.distanceToBoundary(map, position), distanceToCells(map.cells, position));
};
exports.availableSpace = function (map, cell) {
    return Math.min(exports.distanceToBoundary(map, cell.position), distanceToCells(map.cells.filter(function (c) { return c.id !== cell.id; }), cell.position));
};
// modifies cell
exports.adjustCellValues = function (map, cell) {
    cell.units = Math.floor(cell.units);
    var existingCell = map.cells.find(function (c) { return c.id === cell.id; });
    cell.radius = Math.floor(cell.radius);
    cell.units = Math.min(cell.units, 2 * common_1.radiusToUnits(cell.radius));
    cell.position = [Math.floor(cell.position[0]), Math.floor(cell.position[1])];
    if (cell.radius < exports.mapDefaults.minRadius)
        return "Radius too small!";
    var space = exports.availableSpace(map, cell);
    if (space < exports.mapDefaults.minRadius) {
        return "Not enough space!";
    }
    cell.radius = Math.min(space, cell.radius);
    return null;
};
exports.updateCellInMap = function (cell, map) {
    var error = exports.adjustCellValues(map, cell);
    if (error !== null)
        return { map: __assign({}, map), error: error };
    var newCells = __spreadArrays(map.cells);
    var index = newCells.findIndex(function (c) { return c.id === cell.id; });
    if (index >= 0)
        newCells[index] = cell;
    return { map: __assign(__assign({}, map), { cells: newCells }), error: null };
};
exports.removeCellFromMap = function (cellId, map) {
    var newCells = __spreadArrays(map.cells);
    var index = newCells.findIndex(function (c) { return c.id === cellId; });
    if (index >= 0)
        newCells.splice(index, 1);
    return __assign(__assign({}, map), { cells: newCells });
};
exports.addCellToMap = function (cell, map) {
    if (map.cells.some(function (c) { return c.id === cell.id; })) {
        return { map: __assign({}, map), error: null };
    }
    var error = exports.adjustCellValues(map, cell);
    if (error !== null)
        return { map: __assign({}, map), error: error };
    var cells = __spreadArrays(map.cells, [cell]);
    return { map: __assign(__assign({}, map), { cells: cells }), error: null };
};
exports.emptyMap = function () {
    return {
        cells: [],
        players: exports.mapDefaults.maxPlayers,
        width: 1000,
        height: 1000,
    };
};
exports.getPlayerIds = function (map) {
    var players = new Set(map.cells.map(function (c) { return (c.playerId === null ? -1 : c.playerId); }));
    players.delete(-1);
    return players;
};
exports.validateMap = function (map) {
    var message = "";
    if (typeof map.width !== "number" || typeof map.height !== "number") {
        message = "invalid sizes or playercount: set to default";
        map.width = exports.mapDefaults.width;
        map.height = exports.mapDefaults.height;
    }
    if (!Array.isArray(map.cells)) {
        message += "cells are not given as array";
        map.cells = [];
    }
    var m = __assign({}, map);
    for (var i = 0; i < map.cells.length; i++) {
        var cell = map.cells[i];
        if (!isMapCell(cell)) {
            message += "\ninvalid cell";
            continue;
        }
        var r = exports.updateCellInMap(map.cells[i], m);
        if (r.error !== null) {
            m = exports.removeCellFromMap(map.cells[i].id, m);
            message += "\nremoved cell with id " + map.cells[i].id.toString();
        }
        else
            m = r.map;
    }
    var playerCount = new Set(m.cells.map(function (c) { return c.playerId; })).size - 1;
    if (playerCount !== map.players)
        message += "\nnumber of players adjusted";
    return { map: __assign(__assign({}, m), { players: playerCount }), message: message };
};
