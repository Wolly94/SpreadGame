import { ClientGameState } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import SpreadReplay, { HistoryEntry, Move } from "../messages/replay/replay";
import {
  AfterFightState,
  BeforeFightState,
  CapturedCellEvent,
  combinedFightEvents,
  createFightEvent,
  DefeatedBubbleEvent,
  FightEvent,
  finishFightEvent,
  latestDistance,
  SpreadGameEvent,
} from "../skilltree/events";
import Bubble from "./bubble";
import Cell from "./cell";
import { distance } from "./entites";
import { attackerConquerCellFightUtils } from "./gameProps/attackerConquerCell";
import {
  AttackerFightProps,
  attackerFightUtils,
} from "./gameProps/attackerFight";
import { defenderConquerCellUtils } from "./gameProps/defenderConquerCell";
import { defenderDefendCellUtils } from "./gameProps/defenderDefendCell";
import {
  DefenderFightProps,
  defenderFightUtils,
} from "./gameProps/defenderFight";
import { SpreadMap } from "./map/map";
import basicMechanics from "./mechanics/basicMechanics";
import bounceMechanics from "./mechanics/bounceMechanics";
import { SpreadGameMechanics } from "./mechanics/commonMechanics";
import scrapeOffMechanics from "./mechanics/scrapeOffMechanics";
import Player, { dataFromPlayer, playerFromData } from "./player";

const getMechanics = (settings: GameSettings): SpreadGameMechanics => {
  if (settings.mechanics === "basic") {
    return basicMechanics;
  } else if (settings.mechanics === "scrapeoff") {
    return scrapeOffMechanics;
  } else if (settings.mechanics === "bounce") {
    return bounceMechanics;
  } else throw Error("unregistered mechanics");
};

export interface SpreadGameState {
  cells: Cell[];
  bubbles: Bubble[];
  players: Player[];
  timePassed: number;
}

export interface SpreadGameInteraction {
  applyMove: (move: Move) => void;
}

export interface SpreadGameFunctions {
  step: (ms: number) => void;
  toClientGameState: () => ClientGameState;
  getReplay: () => SpreadReplay;
}

export type SpreadGame = SpreadGameState &
  SpreadGameFunctions &
  SpreadGameInteraction;

export class SpreadGameImplementation implements SpreadGame {
  map: SpreadMap;
  gameSettings: GameSettings;
  cells: Cell[];
  bubbles: Bubble[];
  players: Player[];
  pastMoves: HistoryEntry<Move>[];
  mechanics: SpreadGameMechanics;
  timePassed: number;
  eventHistory: HistoryEntry<SpreadGameEvent>[];

  constructor(map: SpreadMap, gameSettings: GameSettings, players: Player[]) {
    //const players = getPlayerIds(map);
    this.gameSettings = gameSettings;
    this.mechanics = getMechanics(gameSettings);
    this.map = map;
    this.cells = map.cells.map((mapCell) => {
      const cell: Cell = {
        id: mapCell.id,
        playerId: mapCell.playerId,
        position: mapCell.position,
        radius: mapCell.radius,
        units: mapCell.units,
      };
      return cell;
    });
    this.bubbles = [];
    this.players = players;
    this.timePassed = 0;
    this.pastMoves = [];
    this.eventHistory = [];
  }

  static fromReplay(replay: SpreadReplay) {
    const spreadGame = new SpreadGameImplementation(
      replay.map,
      replay.gameSettings,
      replay.players.map(playerFromData)
    );
    return spreadGame;
  }

  runReplay(replay: SpreadReplay, ms: number) {
    const movesToDo = replay.moveHistory.filter(
      (mv) =>
        mv.timestamp >= this.timePassed && mv.timestamp < this.timePassed + ms
    );
    const finalTime = Math.min(this.timePassed + ms, replay.lengthInMs);
    while (this.timePassed < finalTime) {
      movesToDo.forEach((mv) => {
        if (mv.timestamp === this.timePassed) {
          this.applyMove(mv.data);
        }
      });
      this.step(replay.gameSettings.updateFrequencyInMs);
    }
  }

  getReplay() {
    const rep: SpreadReplay = {
      map: this.map,
      gameSettings: this.gameSettings,
      moveHistory: this.pastMoves,
      players: this.players.map((pl) => dataFromPlayer(pl)),
      lengthInMs: this.timePassed,
    };
    return rep;
  }

  applyMove(move: Move) {
    if (move.type === "sendunitsmove") {
      this.sendUnits(
        move.data.playerId,
        move.data.senderIds,
        move.data.receiverId
      );
    }
  }

  run(ms: number, updateFrequencyInMs: number) {
    if (ms <= 0) return;
    else {
      this.step(updateFrequencyInMs);
      this.run(ms - updateFrequencyInMs, updateFrequencyInMs);
    }
  }

  step(ms: number) {
    this.bubbles = this.bubbles.map((bubble) =>
      this.mechanics.move(bubble, ms)
    );
    this.cells = this.cells.map((cell) => this.mechanics.grow(cell, ms));
    this.collideBubblesWithCells();
    this.collideBubblesWithBubbles();
    this.checkForFinishedFights();
    this.timePassed += ms;
  }

  collideBubblesWithBubbles() {
    const fightResults: [BeforeFightState, AfterFightState][] = [];
    var remainingBubbles: (Bubble | null)[] = [];
    this.bubbles.forEach((bubble) => {
      const skills1 = this.getSkilledPerks(bubble.playerId);
      var currentBubble: Bubble | null = bubble;
      remainingBubbles = remainingBubbles.map((bubble2) => {
        if (
          currentBubble !== null &&
          bubble2 !== null &&
          this.mechanics.collidesWithBubble(bubble2, currentBubble)
        ) {
          const f1: AttackerFightProps = attackerFightUtils.collect(
            skills1,
            { attacker: bubble2, defender: currentBubble },
            this
          );

          const skills2 = this.getSkilledPerks(bubble2.playerId);
          const f2: AttackerFightProps = attackerFightUtils.collect(
            skills2,
            { attacker: currentBubble, defender: bubble2 },
            this
          );

          const [rem1, rem2] = this.mechanics.collideBubble(
            bubble2,
            currentBubble,
            f2,
            f1
          );
          fightResults.push([
            {
              attacker: bubble2,
              defender: { type: "Bubble", val: currentBubble },
            },
            {
              attacker: rem1,
              defender: { type: "Bubble", val: rem2 },
            },
          ]);
          currentBubble = rem2;
          return rem1;
        } else {
          return bubble2;
        }
      });
      if (currentBubble != null) {
        remainingBubbles.push(currentBubble);
      }
    });
    this.bubbles = remainingBubbles.filter((b): b is Bubble => b !== null);
    fightResults.forEach(([before, after]) => this.processFight(before, after));
  }
  checkForFinishedFights() {
    this.eventHistory = this.eventHistory.map((ev) => {
      if (ev.data.type === "FightEvent" && !ev.data.finished) {
        let returnEvent = { ...ev.data };
        const eventData = ev.data;
        const currentAttacker = this.bubbles.find(
          (b) => b.id === eventData.before.attacker.id
        );
        const currentDefender =
          eventData.before.defender.type === "Cell"
            ? this.cells.find((c) => c.id === eventData.before.defender.val.id)
            : this.bubbles.find(
                (b) => b.id === eventData.before.defender.val.id
              );
        if (currentAttacker === undefined || currentDefender === undefined) {
          // attacker or defender got killed by someone else
          finishFightEvent(returnEvent);
        } else if (
          latestDistance(eventData) <
          distance(currentAttacker.position, currentDefender.position)
        ) {
          // they are moving away from each other
          finishFightEvent(returnEvent);
        }
        return { ...ev, data: returnEvent };
      } else return ev;
    });
  }
  // this either adds a FightEvent or a PartialFightEvent or modifies a PartialFightEvent in the event history
  processFight(before: BeforeFightState, after: AfterFightState) {
    const capturedCellEvent: CapturedCellEvent | null =
      before.defender.type === "Cell" &&
      after.defender.val !== null &&
      after.defender.val.playerId !== null &&
      before.defender.val.playerId !== after.defender.val.playerId
        ? {
            afterPlayerId: after.defender.val.playerId,
            beforePlayerId: before.defender.val.playerId,
            cellId: before.defender.val.id,
            type: "CapturedCell",
          }
        : null;
    const defeatedBubbleEvents: DefeatedBubbleEvent[] = [];
    if (after.attacker === null) {
      defeatedBubbleEvents.push({
        type: "DefeatedBubble",
        defender: after.defender,
      });
    }
    if (after.defender.type === "Bubble" && after.defender.val === null) {
      defeatedBubbleEvents.push({
        type: "DefeatedBubble",
        defender: { type: "Bubble", val: after.attacker },
      });
    }
    const existingPartialFightEvent:
      | FightEvent
      | undefined = this.eventHistory.find(
      (ev): ev is HistoryEntry<FightEvent> =>
        ev.data.type === "FightEvent" &&
        !ev.data.finished &&
        ev.data.before.attacker.id === before.attacker.id &&
        ev.data.before.defender.type === before.defender.type &&
        ev.data.before.defender.val.id === before.defender.val.id
    )?.data;
    if (
      existingPartialFightEvent !== undefined &&
      combinedFightEvents(
        existingPartialFightEvent,
        before,
        after,
        this.timePassed
      )
    ) {
    } else {
      const newEvent = createFightEvent(before, after, this.timePassed);
      this.eventHistory.push({ timestamp: this.timePassed, data: newEvent });
    }
    if (capturedCellEvent !== null)
      this.eventHistory.push({
        timestamp: this.timePassed,
        data: capturedCellEvent,
      });
    defeatedBubbleEvents.forEach((ev) =>
      this.eventHistory.push({ timestamp: this.timePassed, data: ev })
    );
  }
  collideBubblesWithCells() {
    const fightResults: [BeforeFightState, AfterFightState][] = [];
    var remainingBubbles: Bubble[] = [];
    this.bubbles.forEach((bubble) => {
      const skills1 = this.getSkilledPerks(bubble.playerId);

      var currentBubble: Bubble | null = bubble;
      this.cells = this.cells.map((cell) => {
        if (
          currentBubble != null &&
          (currentBubble.motherId !== cell.id ||
            currentBubble.playerId !== cell.playerId) &&
          this.mechanics.collidesWithCell(bubble, cell)
        ) {
          const f1: AttackerFightProps = attackerFightUtils.collect(
            skills1,
            { attacker: bubble, defender: cell },
            this
          );
          const skills2 =
            cell.playerId !== null ? this.getSkilledPerks(cell.playerId) : [];
          const f2: DefenderFightProps = defenderFightUtils.collect(
            skills2,
            { defender: cell, attacker: bubble },
            this
          );
          let [newCurrentBubble, newCell] = this.mechanics.collideCell(
            currentBubble,
            cell,
            f1,
            f2
          );
          fightResults.push([
            { attacker: currentBubble, defender: { type: "Cell", val: cell } },
            {
              attacker: newCurrentBubble,
              defender: { type: "Cell", val: newCell },
            },
          ]);

          if (newCell.playerId !== cell.playerId) {
            const attackerConquerProps = attackerConquerCellFightUtils.collect(
              skills1,
              {},
              this
            );
            const defenderConquerProps = defenderConquerCellUtils.collect(
              skills2,
              {},
              this
            );
            newCell = {
              ...newCell,
              units:
                newCell.units * defenderConquerProps.unitsInPercentToRemain +
                attackerConquerProps.additionalUnits,
            };
          } else {
            /* if (newCell.playerId === cell.playerId) { */
            const defendCellProps = defenderDefendCellUtils.collect(
              skills2,
              {},
              this
            );
            newCell = {
              ...newCell,
              units: newCell.units + defendCellProps.additionalUnits,
            };
          }
          currentBubble = newCurrentBubble;
          //if (event !== null) eventsToAdd.push(event);
          return newCell;
        } else {
          return cell;
        }
      });
      if (currentBubble != null) {
        remainingBubbles.push(currentBubble);
      }
    });
    this.bubbles = remainingBubbles;
    fightResults.forEach(([before, after]) => this.processFight(before, after));
  }
  sendUnits(playerId: number, senderIds: number[], receiverId: number) {
    const eventsToAdd: SpreadGameEvent[] = [];
    const player = this.players.find((p) => p.id == playerId);
    if (player == undefined) return false;
    const targetCell = this.cells.find((c) => c.id == receiverId);
    if (targetCell == undefined) return false;
    const sentIds: number[] = [];
    this.cells = this.cells.map((sender) => {
      if (
        senderIds.some((id) => id === sender.id) &&
        sender.playerId === playerId &&
        sender.id !== receiverId
      ) {
        const [remCell, bubble] = this.mechanics.sendBubble(
          sender,
          targetCell,
          this.timePassed
        );
        if (bubble !== null) {
          this.bubbles.push(bubble);
          eventsToAdd.push({
            type: "SendBubbleEvent",
            sender: sender,
            receiver: targetCell,
          });
          sentIds.push(sender.id);
        }
        return remCell;
      } else {
        return sender;
      }
    });
    this.pastMoves.push({
      timestamp: this.timePassed,
      data: {
        type: "sendunitsmove",
        data: {
          receiverId: targetCell.id,
          senderIds: sentIds,
          playerId: playerId,
        },
      },
    });
    this.eventHistory = this.eventHistory.concat(
      eventsToAdd.map((ev) => {
        return { timestamp: this.timePassed, data: ev };
      })
    );
  }

  toClientGameState() {
    const gs: ClientGameState = {
      timePassedInMs: this.timePassed,
      cells: this.cells.map((cell) => {
        const skills =
          cell.playerId !== null ? this.getSkilledPerks(cell.playerId) : [];
        const fightProps: DefenderFightProps = defenderFightUtils.collect(
          skills,
          { defender: cell, attacker: null },
          this
        );
        return {
          id: cell.id,
          playerId: cell.playerId,
          units: cell.units,
          position: cell.position,
          radius: cell.radius,

          defenderCombatAbilities: fightProps.combatAbilityModifier,
        };
      }),
      bubbles: this.bubbles.map((bubble) => {
        const skills = this.getSkilledPerks(bubble.playerId);
        const fightProps: AttackerFightProps = attackerFightUtils.collect(
          skills,
          { attacker: bubble, defender: null },
          this
        );
        return {
          id: bubble.id,
          playerId: bubble.playerId,
          units: bubble.units,
          position: bubble.position,
          radius: bubble.radius,

          attackCombatAbilities: fightProps.combatAbilityModifier,
        };
      }),
    };
    return gs;
  }
  getSkilledPerks(playerId: number) {
    const pl = this.players.find((pl) => pl.id === playerId);
    if (pl === undefined) return [];
    else return pl.skills;
  }
}
