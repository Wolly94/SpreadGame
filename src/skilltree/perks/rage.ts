import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import Bubble from "../../spreadGame/bubble";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGameEvent } from "../events";
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
    { id: 1, playerId: 0, position: [400, 100], radius: 50, units: 10 },
    { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 100 },
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
        data: { playerId: 1, senderIds: [2], receiverId: 1 },
      },
    },
    {
      timestamp: 2000,
      data: {
        type: "sendunitsmove",
        data: { playerId: 0, senderIds: [0], receiverId: 2 },
      },
    },
  ],
};

const rageCondition = (
  lvl: number,
  eventHistory: HistoryEntry<SpreadGameEvent>[],
  timePassed: number,
  playerId: number
) => {
  if (lvl <= 0) return false;
  const val = values[Math.min(lvl, values.length) - 1];
  const toleratedTimeSpan = val[0];
  const lostCellEvents = eventHistory.filter(
    (ev) =>
      ev.timestamp >= timePassed - toleratedTimeSpan &&
      ev.data.type === "CapturedCell" &&
      ev.data.beforePlayerId === playerId
  );
  return lostCellEvents.length > 0;
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
  effects: [
    {
      type: "AttackerFightEffect",
      getValue: (lvl, attacker, spreadGame) => {
        if (
          rageCondition(
            lvl,
            spreadGame.eventHistory,
            spreadGame.timePassed,
            attacker.playerId
          )
        ) {
          const val = values[Math.min(lvl, values.length) - 1];
          return {
            combatAbilityModifier: val[1],
          };
        } else {
          return { combatAbilityModifier: 0 };
        }
      },
    },
  ],
  replay: replay,
};
