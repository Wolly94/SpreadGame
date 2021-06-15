import SpreadReplay from "../../messages/replay/replay";
import { unitsToRadius } from "../../spreadGame/common";
import { defenderDefendCellUtils } from "../../spreadGame/gameProps/defenderDefendCell";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "Loots of Victory";
const values: number[] = [5, 10];
const defaultValue = 0;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    {
      id: 0,
      playerId: 0,
      position: [100, 100],
      radius: unitsToRadius(45),
      units: 45,
    },
    {
      id: 1,
      playerId: 1,
      position: [400, 100],
      radius: unitsToRadius(50),
      units: 50,
    },
    {
      id: 2,
      playerId: 1,
      position: [100, 400],
      radius: unitsToRadius(50),
      units: 50,
    },
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
    {
      timestamp: 25,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [2], receiverId: 0 },
      },
    },
  ],
};

export const LootsOfVictory: Perk<number> = {
  name: name,
  values: values,
  description:
    "For every successful defense the cell gains + " +
    formatDescription(values, (val) => val.toString(), "/") +
    " population.",
  effects: [
    {
      type: "DefenderDefendCellEffect",
      getValue: (lvl) => {
        const val = getValue(values, lvl, defaultValue);
        return {
          ...defenderDefendCellUtils.default,
          additionalUnits: val,
        };
      },
    },
  ],
  replay: replay,
};
