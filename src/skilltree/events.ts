import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { distance } from "../spreadGame/entites";

export interface FightData {
  unitsLost: number;
  position: [number, number];
  currentPlayerId: number | null;
}

export interface PartialFight {
  attacker: FightData;
  defender: FightData;
}

const fromFightStates = (
  before: BeforeFightState,
  after: AfterFightState
): PartialFight => {
  const attacker: FightData = {
    currentPlayerId: before.attacker.playerId,
    position: before.attacker.position,
    unitsLost:
      before.attacker.units -
      (after.attacker !== null ? after.attacker.units : 0),
  };

  const defender: FightData = {
    currentPlayerId: before.defender.val.playerId,
    position: before.defender.val.position,
    unitsLost:
      before.defender.val.units -
      (after.defender.val !== null ? after.defender.val.units : 0),
  };
  return { attacker: attacker, defender: defender };
};

export interface BeforeFightState {
  attacker: Bubble;
  defender: { type: "Bubble"; val: Bubble } | { type: "Cell"; val: Cell };
}

export type AfterFightDefenderState =
  | { type: "Bubble"; val: Bubble | null }
  | { type: "Cell"; val: Cell };

export interface AfterFightState {
  attacker: Bubble | null;
  defender: AfterFightDefenderState;
}

export interface FightEvent {
  type: "FightEvent";
  before: BeforeFightState;
  after: AfterFightState;
  finished: boolean;
  partialFights: HistoryEntry<PartialFight>[];
}

export const latestDistance = (event: FightEvent): number => {
  const latestState = event.partialFights.slice(-1)[0].data;
  return distance(latestState.attacker.position, latestState.defender.position);
};

export const fightEventFinished = (event: FightEvent) => {
  return event.finished;
};

export const finishFightEvent = (event: FightEvent) => {
  event.finished = true;
  return event;
};

export const entitiesApproached = (
  before: PartialFight,
  after: PartialFight
): boolean => {
  const newDist = distance(after.attacker.position, after.defender.position);
  const latestDist = distance(
    before.attacker.position,
    before.defender.position
  );
  return latestDist > newDist;
};

export const createFightEvent = (
  beforeFight: BeforeFightState,
  afterFight: AfterFightState,
  timePassed: number
): FightEvent => {
  const partialFight = fromFightStates(beforeFight, afterFight);
  return {
    type: "FightEvent",
    partialFights: [{ timestamp: timePassed, data: partialFight }],
    after: afterFight,
    before: beforeFight,
    finished: false,
  };
};

// either modifies FightEvent in place or creates a new one
export const combinedFightEvents = (
  e1: FightEvent,
  beforeFight: BeforeFightState,
  afterFight: AfterFightState,
  timePassed: number
): boolean => {
  const partialFight = fromFightStates(beforeFight, afterFight);
  const latestState = e1.partialFights.slice(-1)[0].data;
  if (
    entitiesApproached(latestState, partialFight) &&
    !fightEventFinished(e1)
  ) {
    e1.partialFights.push({ timestamp: timePassed, data: partialFight });
    e1.after = afterFight;
    if (
      afterFight.attacker === null ||
      (afterFight.defender.type === "Bubble" &&
        afterFight.defender.val === null) ||
      (afterFight.defender.type === "Cell" &&
        partialFight.defender.currentPlayerId !==
          beforeFight.defender.val.playerId)
    ) {
      finishFightEvent(e1);
    }
    return true;
  } else {
    finishFightEvent(e1);
    return false;
  }
};

export interface SendBubbleEvent {
  type: "SendBubbleEvent";
  sender: Cell;
  receiver: Cell;
}

export interface CapturedCellEvent {
  type: "CapturedCell";
  cellId: number;
  beforePlayerId: number | null;
  afterPlayerId: number;
}

export interface DefeatedBubbleEvent {
  type: "DefeatedBubble";
  defender: AfterFightDefenderState;
}

export type SpreadGameEvent =
  | FightEvent
  | SendBubbleEvent
  | CapturedCellEvent
  | DefeatedBubbleEvent;
