import SpreadReplay, { HistoryEntry } from "../../messages/replay/replay";
import { unitsToRadius } from "../../spreadGame/common";
import { SpreadMap } from "../../spreadGame/map/map";
import { combineDefenderFightProps } from "../../spreadGame/spreadGameProps";
import { FightEvent } from "../events";
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

const alreadyAbsorbed = (event: FightEvent): number => {
  if (event.finished) return 0;
  else {
    return event.partialFights.reduce(
      (prev, curr) => prev + curr.data.attacker.unitsLost,
      0
    );
  }
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
      getValue: (lvl, trigger, spreadGame) => {
        const attacker = trigger.attacker;
        const val = getValue(values, lvl, defaultValue);
        const activeEvent: FightEvent | undefined =
          attacker === null
            ? undefined
            : spreadGame.eventHistory.find(
                (ev): ev is HistoryEntry<FightEvent> =>
                  ev.data.type === "FightEvent" &&
                  !ev.data.finished &&
                  ev.data.before.attacker.id === attacker.id &&
                  ev.data.before.defender.type === "Cell" &&
                  ev.data.before.defender.val.id === trigger.defender.id
              )?.data;
        const absorbed =
          activeEvent === undefined ? 0 : alreadyAbsorbed(activeEvent);
        return {
          combatAbilityModifier: 0,
          membraneAbsorption: Math.max(val - absorbed, 0),
        };
      },
    },
  ],
  replay: replay,
};
