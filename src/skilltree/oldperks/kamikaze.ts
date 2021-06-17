import SpreadReplay from "../../messages/replay/replay";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "Kamikaze";
const values: number[] = [0.8, 0.5];
const defaultValue = 1;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 50 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 200 },
  ],
  players: 2,
};

const replay: SpreadReplay = {
  gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
  lengthInMs: 5000,
  map: simpleMap,
  players: [
    { id: 0, skills: [{ name: name, level: 2 }] },
    { id: 1, skills: [] },
  ],
  moveHistory: [
    {
      timestamp: 0,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [1], receiverId: 0 },
      },
    },
  ],
};

export const Kamikaze: Perk<number> = {
  name: name,
  values: values,
  description:
    "When a cell is lost only " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    +" of the conquering army remains.",
  effects: [
    {
      type: "DefenderConquerCellEffect",
      getValue: (lvl) => {
        const val = getValue(values, lvl, defaultValue);
        return {
          unitsInPercentToRemain: val,
        };
      },
    },
  ],
  replay: replay,
};
