import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import Cell from "../../spreadGame/cell";
import { unitsToRadius } from "../../spreadGame/common";
import { defenderFightUtils } from "../../spreadGame/gameProps/defenderFight";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGameEvent } from "../events";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "Preparation";
const values: [number, number][] = [
  [1, 50],
  [2, 100],
];
const defaultValue: [number, number] = [0, 0];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    {
      id: 0,
      playerId: 0,
      position: [200, 200],
      radius: unitsToRadius(204),
      units: 204,
    },
    {
      id: 1,
      playerId: 1,
      position: [400, 100],
      radius: unitsToRadius(100),
      units: 100,
    },
  ],
  players: 2,
};

const replay: SpreadReplay = {
  gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
  lengthInMs: 5000,
  map: simpleMap,
  players: [
    { id: 0, skills: [] },
    { id: 1, skills: [{ name: name, level: 2 }] },
  ],
  moveHistory: [
    {
      timestamp: 2000,
      data: {
        type: "sendunitsmove",
        data: { playerId: 0, senderIds: [0], receiverId: 1 },
      },
    },
  ],
};

const latestMoveTimeStamp = (
  cell: Cell,
  eventHistory: HistoryEntry<SpreadGameEvent>[]
): number => {
  const lastAttackSent = eventHistory
    .filter(
      (ev) =>
        ev.data.type === "SendBubbleEvent" && ev.data.sender.id === cell.id
    )
    .slice(-1)[0];
  const lastConquered = eventHistory
    .filter(
      (ev) =>
        ev.data.type === "CapturedCell" &&
        ev.data.cellId === cell.id &&
        ev.data.beforePlayerId !== ev.data.afterPlayerId // this is unneccessary
    )
    .slice(-1)[0];
  const latestTimeStamp = Math.max(
    lastAttackSent === undefined ? 0 : lastAttackSent.timestamp,
    lastConquered === undefined ? 0 : lastConquered.timestamp
  );
  return latestTimeStamp;
};

export const Preparation: Perk<[number, number]> = {
  name: name,
  values: values,
  description:
    "Raises combat abilities of your cells by " +
    formatDescription(values, (val) => val[0].toString() + "%", "/") +
    " for each second that cell did not send an attack, capped at " +
    formatDescription(values, (val) => val[1].toString() + "%", "/") +
    ".",
  effects: [
    {
      type: "DefenderFightEffect",
      getValue: (lvl, trigger, spreadGame) => {
        const val = getValue(values, lvl, defaultValue);
        const idleSince = latestMoveTimeStamp(
          trigger.defender,
          spreadGame.eventHistory
        );
        return {
          ...defenderFightUtils.default,
          combatAbilityModifier: Math.min(
            (val[0] * (spreadGame.timePassed - idleSince)) / 1000,
            val[1]
          ),
        };
      },
    },
  ],
  replay: replay,
};
