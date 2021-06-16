import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import { attackerDefendCellUtils } from "../../spreadGame/gameProps/attackerDefendCell";
import { SpreadMap } from "../../spreadGame/map/map";
import { FightEvent, finishFightEvent } from "../events";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "BaseInfection";
const values = [0.01, 0.03, 0.05];
const defaultValue = 0;

const simpleMap: SpreadMap = {
  width: 500,
  height: 500,
  cells: [
    { id: 0, playerId: 0, position: [100, 100], radius: 50, units: 100 },
    { id: 1, playerId: 1, position: [400, 100], radius: 50, units: 50 },
    { id: 2, playerId: 1, position: [250, 400], radius: 50, units: 50 },
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

export const BaseInfection: Perk<number> = {
  name: name,
  values: values,
  description:
    "Cells you attacked stop growing for " +
    formatDescription(
      values,
      (val) => "#attacker/" + (1 / val).toString(),
      ", "
    ) +
    " seconds.",
  effects: [
    {
      type: "AttackerDefendCellEffect",
      getValue: (lvl, trigger, spreadGame) => {
        const fightEvents = spreadGame.eventHistory.filter(
          (ev): ev is HistoryEntry<FightEvent> =>
            ev.data.type === "FightEvent" &&
            ev.data.before.attacker.playerId === trigger.attackerPlayerId &&
            ev.data.before.defender.type === "Cell" &&
            ev.data.before.defender.val.id === trigger.defender.id
        );
        const finishedFightEvents = fightEvents.filter(
          (ev) => ev.data.finished && ev.data.after.attacker === null
        );
        const val = getValue(values, lvl, defaultValue);
        const blocked = finishedFightEvents.reduce((prev, curr) => {
          const timeBlockedInMs = curr.data.before.attacker.units * val * 1000;
          return Math.max(
            prev,
            curr.timestamp + timeBlockedInMs - spreadGame.timePassed
          );
        }, 0);
        return { ...attackerDefendCellUtils, blockGrowthInMs: blocked };
      },
    },
  ],
  replay: replay,
};
