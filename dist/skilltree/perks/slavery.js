"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var name = "Slavery";
var values = [10];
var simpleMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 120 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
  ],
  players: 2,
};
var replay = {
  gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
  lengthInMs: 5000,
  map: simpleMap,
  players: [
    { id: 0, skills: [{ name: name, level: 1 }] },
    { id: 1, skills: [] },
  ],
  moveHistory: [
    {
      timestamp: 0,
      data: {
        type: "sendunitsmove",
        data: { playerId: 0, senderIds: [0], receiverId: 1 },
      },
    },
  ],
};
exports.Slavery = {
  name: name,
  values: values,
  description:
    "Every newly conquered cell gains +" +
    utils_1.formatDescription(
      values,
      function (val) {
        return val.toString();
      },
      "/"
    ) +
    " population.",
  effects: [
    {
      type: "AttackerConquerCellEffect",
      getValue: function (lvl) {
        if (lvl <= 0) {
          return { additionalUnits: 0 };
        } else {
          var val = values[Math.min(lvl, values.length) - 1];
          return {
            additionalUnits: val,
          };
        }
      },
    },
  ],
  replay: replay,
};
