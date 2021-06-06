import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import Bubble from "../../spreadGame/bubble";
import { unitsToRadius } from "../../spreadGame/common";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGameEvent } from "../events";
import { formatDescription } from "../utils";
import { Perk } from "./perk";

const name = "Berserk";
const values: [number, number][] = [
  [2000, 5],
  [2000, 10],
];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
    {
      id: 2,
      playerId: 1,
      position: [250, 400],
      radius: unitsToRadius(25),
      units: 25,
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
        data: { playerId: 0, senderIds: [0], receiverId: 1 },
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

const currentAttacksSent = (
  toleratedTimeSpan: number,
  attacker: Bubble,
  eventHistory: HistoryEntry<SpreadGameEvent>[]
) => {
  const attacksSentBeforeCreation = eventHistory.filter(
    (ev) =>
      ev.data.type === "SendBubbleEvent" &&
      ev.data.sender.id === attacker.motherId &&
      ev.data.sender.playerId === attacker.playerId &&
      ev.timestamp >= attacker.creationTime - toleratedTimeSpan &&
      ev.timestamp < attacker.creationTime
  );
  return attacksSentBeforeCreation.length;
};

export const Berserk: Perk<[number, number]> = {
  name: name,
  values: values,
  description:
    "For every consecutive (within " +
    formatDescription(values, (val) => (val[0] / 1000).toString(), "/") +
    " seconds after the last) attack a cell orders it's attack increases by " +
    formatDescription(values, (val) => val[1].toString() + "%", "/") +
    ".",
  effects: [
    {
      type: "AttackerFightEffect",
      getValue: (lvl, attacker, spreadGame) => {
        if (lvl <= 0) return { combatAbilityModifier: 0 };
        const val = values[Math.min(lvl, values.length) - 1];
        const toleratedTimeSpan = val[0];
        const attacksSent = currentAttacksSent(
          toleratedTimeSpan,
          attacker,
          spreadGame.eventHistory
        );
        return {
          combatAbilityModifier: val[1] * attacksSent,
        };
      },
    },
  ],
  replay: replay,
};
