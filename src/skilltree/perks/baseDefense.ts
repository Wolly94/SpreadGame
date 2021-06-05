import SpreadReplay from "../../messages/replay/replay";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { Perk } from "./perk";

const name = "BaseDefense";
const values = [10, 20, 30];

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
    { id: 0, skills: [] },
    { id: 1, skills: [{ name: name, level: 3 }] },
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

export const BaseDefense: Perk<number> = {
  name: name,
  values: values,
  description:
    "Raises combat abilities of your cells by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    ".",
  effect: [
    {
      type: "DefenderFightEffect",
      getValue: (lvl) => {
        if (lvl <= 0) return { combatAbilityModifier: 0 };
        else
          return {
            combatAbilityModifier: values[Math.min(lvl, values.length) - 1],
          };
      },
    },
  ],
  replay: replay,
};
