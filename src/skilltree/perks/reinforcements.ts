import SpreadReplay from "../../messages/replay/replay";
import { growthUtils } from "../../spreadGame/gameProps/cellGrowth";
import { defenderStartUtils } from "../../spreadGame/gameProps/defenderStart";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { Perk, getValue } from "./perk";

const name = "Reinforcements";
const values = [9, 15];
const defaultValue = 0;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 10 },
    { id: 1, playerId: 1, position: [400, 400], radius: 50, units: 10 },
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
  moveHistory: [],
};

export const Reinforcements: Perk<number> = {
  name: name,
  values: values,
  description:
    "At the beginning, every friendly cell starts with +" +
    formatDescription(values, (val) => val.toString(), "/") +
    " population.",
  effects: [
    {
      type: "DefenderStartEffect",
      getValue: (lvl, trigger, spreadGame) => {
        const val = getValue(values, lvl, defaultValue);
        return {
          ...defenderStartUtils.default,
          additionalUnits: val,
        };
      },
    },
  ],
  replay: replay,
};
