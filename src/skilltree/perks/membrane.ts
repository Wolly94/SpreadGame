import SpreadReplay from "../../messages/replay/replay";
import { unitsToRadius } from "../../spreadGame/common";
import { SpreadMap } from "../../spreadGame/map/map";
import { combineDefenderFightProps } from "../../spreadGame/spreadGameProps";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "Membrane";
const values = [10];
const defaultValue = 0;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    {
      id: 0,
      playerId: 0,
      position: [100, 100],
      radius: unitsToRadius(40),
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
    { id: 0, skills: [{ name: name, level: 1 }] },
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
      timestamp: 0,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [2], receiverId: 0 },
      },
    },
  ],
};

export const Membrane: Perk<number> = {
  name: name,
  values: values,
  description:
    "The first " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    " of every attacking enemy bubble die to the membrane before doing damage.",
  effects: [
    {
      type: "DefenderFightEffect",
      getValue: (lvl) => {
        const val = getValue(values, lvl, defaultValue);
        return {
          combatAbilityModifier: 0,
          membraneAbsorption: val,
        };
      },
    },
  ],
  replay: replay,
};
