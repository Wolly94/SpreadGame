import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import Cell from "../../spreadGame/cell";
import { unitsToRadius } from "../../spreadGame/common";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGameEvent } from "../events";
import { formatDescription } from "../utils";
import { Perk } from "./perk";

const name = "Preparation";
const values = [1, 2];

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    {
      id: 0,
      playerId: 0,
      position: [100, 100],
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
    .filter((ev) => ev.data.type === "LostCell" && ev.data.cellId === cell.id)
    .slice(-1)[0];
  const latestTimeStamp = Math.max(
    lastAttackSent === undefined ? 0 : lastAttackSent.timestamp,
    lastConquered === undefined ? 0 : lastConquered.timestamp
  );
  return latestTimeStamp;
};

export const Preparation: Perk<number> = {
  name: name,
  values: values,
  description:
    "Raises combat abilities of your cells by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    " for each second that cell did not send an attack.",
  effect: [
    {
      type: "DefenderFightEffect",
      getValue: (lvl, defender, spreadGame) => {
        if (lvl <= 0) return { combatAbilityModifier: 0 };
        else {
          const idleSince = latestMoveTimeStamp(
            defender,
            spreadGame.eventHistory
          );
          return {
            combatAbilityModifier:
              (values[Math.min(lvl, values.length) - 1] *
                (spreadGame.timePassed - idleSince)) /
              1000,
          };
        }
      },
    },
  ],
  replay: replay,
};
