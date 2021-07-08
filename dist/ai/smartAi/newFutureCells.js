"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cellReceiverCapabilites_1 = require("./cellReceiverCapabilites");
var cellSenderCapabilities_1 = require("./cellSenderCapabilities");
var getForecast = function (game, reachMap) {
    var senderCapabilities = cellSenderCapabilities_1.CellSenderCapabilityImplementation.fromGame(game);
    var receiverCapabilities = new cellReceiverCapabilites_1.CellReceiverCapabilityImplementation(reachMap, game.cells.map(function (c) { return c.id; }), senderCapabilities);
};
