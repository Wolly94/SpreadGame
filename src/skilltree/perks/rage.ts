import SpreadReplay from "../../messages/replay/replay";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { Perk } from "./perk";

const name = "Rage";
const values: [number, number][] = [
  [2000, 20],
  [3000, 30],
];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
    { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 50 },
  ],
  players: 2,
};

const replay: SpreadReplay = {
  gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
  lengthInMs: 5000,
  map: simpleMap,
  players: [
    { id: 0, skills: [{ name: name, level: 3 }] },
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
    {
      timestamp: 0,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [1], receiverId: 0 },
      },
    },
    {
      timestamp: 1000,
      data: {
        type: "sendunitsmove",
        data: { playerId: 0, senderIds: [0], receiverId: 2 },
      },
    },
  ],
};

export const Rage: Perk<[number, number]> = {
  name: name,
  values: values,
  description:
    "Whenever a friendly cell is lost, combat abilities of all currently existing bubbles are increased by " +
    formatDescription(values, (val) => val[1].toString() + "%", "/") +
    " for " +
    formatDescription(values, (val) => (val[0] / 1000).toString(), "/") +
    " seconds.",
  effect: [
    {
      type: "FightEffect",
      getValue: (lvl) => {
        if (lvl <= 0) return { attackModifier: 0 };
        else
          return {
            attackModifier: values[Math.min(lvl, values.length) - 1][1],
          };
      },
    },
  ],
  replay: replay,
};
