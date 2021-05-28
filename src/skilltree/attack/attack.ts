import SpreadReplay from "../../messages/replay/replay";
import { SpreadMap } from "../../spreadGame/map/map";
import { Perk, Skill } from "../skilltree";
import { formatDescription } from "../utils";

const name = "BaseAttack";
const values = [10, 20, 30];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
    { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 100 },
  ],
  players: 2,
};

const replay: SpreadReplay = {
  gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
  lengthInMs: 5000,
  map: simpleMap,
  players: [{ id: 0, skills: [{ name: name, level: 3 }] }],
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

export const BaseAttack: Perk<number> = {
  name: name,
  values: values,
  description:
    "Raises damage of your bubbles by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    ".",
  effect: [
    {
      type: "FightEffect",
      getValue: (lvl) => {
        if (lvl <= 0) return { attackModifier: 0 };
        else
          return { attackModifier: values[Math.min(lvl, values.length) - 1] };
      },
    },
  ],
  replay: replay,
};

export const Attack: Skill = {
  name: "Attack",
  perks: [BaseAttack],
};
