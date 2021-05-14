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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var map_1 = require("./map");
var minDistance = 10;
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var calculateDensity = function (map) {
    var covered = map.cells.reduce(function (coveredSpace, cell) {
        return coveredSpace + Math.PI * Math.pow(cell.radius, 2);
    }, 0);
    return covered / (map.width * map.height);
};
var getStartingUnits = function (saturated) {
    var lowerPart = 1 / 8;
    var maxPart = 1 - lowerPart;
    var x01 = Math.random();
    var xCapped = lowerPart + x01 * (maxPart - lowerPart);
    var xCappedM11 = 2 * (xCapped - 1 / 2);
    var v = (saturated / 2) * (Math.pow(xCappedM11, 11) + 1);
    var result = Math.ceil(v);
    return result;
};
exports.generate2PlayerMap = function (squareSideLength) {
    var cellId = 1;
    var cellDensity = 0.05;
    var cellRadii = [25, 100];
    var playerDist = [12, 3, 1]; // 12 null : 3 owner of side : 1 owner of other side
    var radiusAccuracy = 5;
    var setStartingCells = false;
    var map = map_1.emptyMap();
    map.width = squareSideLength;
    map.height = squareSideLength;
    var half = squareSideLength / 2;
    var mapCenter = [half, half];
    var _loop_1 = function () {
        var centered = false;
        var number = getRandomIntInclusive(setStartingCells ? 1 : playerDist[0] + 1, playerDist.reduce(function (s, n) { return s + n; }, 0));
        var playerId = null;
        if (number <= playerDist[0]) {
            playerId = null;
        }
        else if (number <= playerDist[1] + playerDist[0]) {
            playerId = 0;
        }
        else {
            playerId = 1;
        }
        var radius = getRandomIntInclusive(cellRadii[0] / radiusAccuracy, cellRadii[1] / radiusAccuracy) * radiusAccuracy;
        var x = getRandomIntInclusive(0, half);
        var y = getRandomIntInclusive(0, 2 * half);
        var avSpace = map_1.availableSpaceFromPosition(map, [x, y]);
        radius = Math.min(avSpace - minDistance, radius);
        if (Math.pow((x - mapCenter[0]), 2) + Math.pow((y - mapCenter[1]), 2) <= Math.pow(radius, 2)) {
            x = mapCenter[0];
            y = mapCenter[1];
            centered = true;
            playerId = -1;
        }
        var cell1 = {
            id: cellId,
            playerId: centered ? null : playerId,
            radius: radius,
            units: 0,
            position: [x, y],
        };
        var r = map_1.addCellToMap(cell1, map);
        if (r.error !== null)
            return "continue";
        //const units = getRandomIntInclusive(radius / 8, radius)
        map = r.map;
        var createdCellIndex = map.cells.findIndex(function (c) { return c.id === cell1.id; });
        if (createdCellIndex < 0)
            return "continue";
        else {
            var units = getStartingUnits(common_1.radiusToUnits(map.cells[createdCellIndex].radius));
            map.cells[createdCellIndex].units = units;
            cell1.units = units;
        }
        cellId = cellId + 1;
        if (!centered) {
            var rotatedPosition = [
                2 * mapCenter[0] - x,
                2 * mapCenter[1] - y,
            ];
            var cell2 = __assign(__assign({}, cell1), { position: rotatedPosition, playerId: playerId !== null ? 1 - playerId : playerId, id: cellId });
            cellId = cellId + 1;
            var r2 = map_1.addCellToMap(cell2, map);
            if (playerId !== null)
                setStartingCells = true;
            map = r2.map;
        }
    };
    // generate cells on the map
    while (calculateDensity(map) < cellDensity) {
        _loop_1();
    }
    return map;
};
