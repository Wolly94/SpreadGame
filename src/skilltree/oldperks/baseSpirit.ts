import SpreadReplay from "../../messages/replay/replay";
import Cell from "../../spreadGame/cell";
import { unitsToRadius } from "../../spreadGame/common";
import { attackerFightUtils } from "../../spreadGame/gameProps/attackerFight";
import { defenderFightUtils } from "../../spreadGame/gameProps/defenderFight";
import { SpreadMap } from "../../spreadGame/map/map";
import { formatDescription } from "../utils";
import { getValue, Perk } from "./perk";

const name = "BaseSpirit";
const values = [2, 4, 6];
const defaultValue = 0;

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
      radius: unitsToRadius(68),
      units: 68,
    },
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
      timestamp: 1000,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [2], receiverId: 0 },
      },
    },
    {
      timestamp: 1500,
      data: {
        type: "sendunitsmove",
        data: { playerId: 1, senderIds: [2], receiverId: 0 },
      },
    },
  ],
};

const getCellDiff = (
  cells: Array<Cell>,
  enemyPlayerId: number,
  ownPlayerId: number | null
) => {
  const attackerBubbles = cells.filter((b) => b.playerId === enemyPlayerId)
    .length;
  const defenderBubbles = cells.filter((b) => b.playerId === ownPlayerId)
    .length;
  return attackerBubbles - defenderBubbles;
};

export const BaseSpirit: Perk<number> = {
  name: name,
  values: values,
  description:
    "Attack and defense are increased by " +
    formatDescription(values, (val) => val.toString() + "%", "/") +
    " for every cell the enemy has more than you.",
  effects: [
    {
      type: "AttackerFightEffect",
      getValue: (lvl, trigger, spreadGame) => {
        if (trigger.defender !== null && trigger.defender.playerId !== null) {
          const val = getValue(values, lvl, defaultValue);
          const x = getCellDiff(
            spreadGame.cells,
            trigger.defender.playerId,
            trigger.attacker.playerId
          );
          return {
            ...attackerFightUtils.default,
            combatAbilityModifier: val * x,
          };
        } else {
          return attackerFightUtils.default;
        }
      },
    },
    {
      type: "DefenderFightEffect",
      getValue: (lvl, trigger, spreadGame) => {
        if (trigger.defender.playerId !== null && trigger.attacker !== null) {
          const val = getValue(values, lvl, defaultValue);
          const x = getCellDiff(
            spreadGame.cells,
            trigger.attacker.playerId,
            trigger.defender.playerId
          );
          return {
            ...defenderFightUtils.default,
            combatAbilityModifier: val,
          };
        } else if (
          trigger.defender.playerId !== null /* && attacker === null */
        ) {
          // TODO change if you want a visual effect in terms of combat ability modifier for the cells
          return defenderFightUtils.default;
        } else {
          return defenderFightUtils.default;
        }
      },
    },
  ],
  replay: replay,
};
