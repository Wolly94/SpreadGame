import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import Bubble from "../../spreadGame/bubble";
import { unitsToRadius } from "../../spreadGame/common";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGameEvent } from "../events";
import { formatDescription } from "../utils";
import { Perk } from "./perk";

const name = "Slavery";
const values: number[] = [10];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 120 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
  ],
  players: 2,
};

const replay: SpreadReplay = {
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

export const Slavery: Perk<number> = {
  name: name,
  values: values,
  description:
    "Every newly conquered cell gains +" +
    formatDescription(values, (val) => val.toString(), "/") +
    " population.",
  effects: [
    {
      type: "AttackerConquerCellEffect",
      getValue: (lvl) => {
        if (lvl <= 0) {
          return { additionalUnits: 0 };
        } else {
          const val = values[Math.min(lvl, values.length) - 1];
          return {
            additionalUnits: val,
          };
        }
      },
    },
  ],
  replay: replay,
};
