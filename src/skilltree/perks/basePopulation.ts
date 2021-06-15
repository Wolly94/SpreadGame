import SpreadReplay from "../../messages/replay/replay";
import Cell from "../../spreadGame/cell";
import { unitsToRadius } from "../../spreadGame/common";
import { attackerFightUtils } from "../../spreadGame/gameProps/attackerFight";
import { growthUtils } from "../../spreadGame/gameProps/cellGrowth";
import { defenderFightUtils } from "../../spreadGame/gameProps/defenderFight";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "BasePopulation";
const values = [20, 40, 60];
const defaultValue = 0;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 50 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
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
  moveHistory: [],
};

export const BasePopulation: Perk<number> = {
  name: name,
  values: values,
  description:
    "Capacity is increased by " +
    formatDescription(values, (val) => val.toString(), "/") +
    ".",
  effects: [
    {
      type: "GrowthEffect",
      getValue: (lvl, trigger, spreadGame) => {
        const val = getValue(values, lvl, defaultValue);
        return {
          ...growthUtils.default,
          additionalCapacity: val,
        };
      },
    },
  ],
  replay: replay,
};
