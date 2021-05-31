import { ClientGameState } from "../messages/inGame/clientGameState";
import { GameSettings } from "../messages/inGame/gameServerMessages";
import SpreadReplay, { HistoryEntry, Move } from "../messages/replay/replay";
import { SpreadGameEvent } from "../skilltree/events";
import { Rage } from "../skilltree/perks/rage";
import { skillTreeMethods } from "../skilltree/skilltree";
import Bubble from "./bubble";
import Cell from "./cell";
import { SpreadMap, getPlayerIds } from "./map/map";
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

export interface FightProps {
  attackModifier: number;
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

  step(ms: number) {
    this.bubbles = this.bubbles.map((bubble) =>
      this.mechanics.move(bubble, ms)
    );
    this.cells = this.cells.map((cell) => this.mechanics.grow(cell, ms));
    this.collideBubblesWithCells();
    this.collideBubblesWithBubbles();
    this.timePassed += ms;
  }

  collideBubblesWithBubbles() {
    var eventsToAdd: SpreadGameEvent[] = [];
    var remainingBubbles: (Bubble | null)[] = [];
    this.bubbles.forEach((bubble) => {
      const st1 = this.players.find((pl) => pl.id === bubble.playerId);
      const f1 =
        st1 === undefined
          ? { attackModifier: 1.0 }
          : skillTreeMethods.getAttackerModifier(st1.skills, bubble, this);

      var currentBubble: Bubble | null = bubble;
      remainingBubbles = remainingBubbles.map((bubble2) => {
        if (currentBubble !== null && bubble2 !== null) {
          const st2 = this.players.find((pl) => pl.id === bubble2.playerId);
          const f2 =
            st2 === undefined
              ? { attackModifier: 1.0 }
              : skillTreeMethods.getAttackerModifier(st2.skills, bubble2, this);

          const [rem1, rem2] = this.mechanics.collideBubble(
            bubble2,
            currentBubble,
            f2,
            f1
          );
          if (rem1 === null) {
            eventsToAdd.push({
              type: "LostBubble",
              playerId: bubble2.playerId,
              opponentEntity: { type: "Bubble", bubble: currentBubble },
            });
          }
          if (rem2 === null) {
            eventsToAdd.push({
              type: "LostBubble",
              playerId: currentBubble.playerId,
              opponentEntity: { type: "Bubble", bubble: bubble2 },
            });
          }
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
    this.eventHistory = this.eventHistory.concat(
      eventsToAdd.map((ev) => {
        return { timestamp: this.timePassed, data: ev };
      })
    );
  }
  collideBubblesWithCells() {
    const eventsToAdd: SpreadGameEvent[] = [];
    var remainingBubbles: Bubble[] = [];
    this.bubbles.forEach((bubble) => {
      const st1 = this.players.find((pl) => pl.id === bubble.playerId);
      const f1 =
        st1 === undefined
          ? { attackModifier: 1.0 }
          : skillTreeMethods.getAttackerModifier(st1.skills, bubble, this);

      var currentBubble: Bubble | null = bubble;
      this.cells = this.cells.map((cell) => {
        if (
          currentBubble != null &&
          (currentBubble.motherId !== cell.id ||
            currentBubble.playerId !== cell.playerId)
        ) {
          const [newCurrentBubble, newCell] = this.mechanics.collideCell(
            currentBubble,
            cell,
            f1,
            {
              attackModifier: 1.0,
            }
          );
          if (newCell.playerId !== cell.playerId) {
            eventsToAdd.push({
              type: "LostCell",
              opponentPlayerId: newCell.id,
              opponentBubbleId: currentBubble.id,
              cellId: newCell.id,
              playerId: cell.playerId,
            });
          }
          if (newCurrentBubble === null) {
            eventsToAdd.push({
              type: "LostBubble",
              playerId: currentBubble.playerId,
              opponentEntity: { type: "Cell", cell: cell },
            });
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
    this.eventHistory = this.eventHistory.concat(
      eventsToAdd.map((ev) => {
        return { timestamp: this.timePassed, data: ev };
      })
    );
  }
  sendUnits(playerId: number, senderIds: number[], receiverId: number) {
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
        const [remCell, bubble] = this.mechanics.sendBubble(sender, targetCell);
        if (bubble !== null) {
          this.bubbles.push(bubble);
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
  }

  toClientGameState() {
    const gs: ClientGameState = {
      timePassedInMs: this.timePassed,
      cells: this.cells.map((cell) => {
        return {
          id: cell.id,
          playerId: cell.playerId,
          units: cell.units,
          position: cell.position,
          radius: cell.radius,
        };
      }),
      bubbles: this.bubbles.map((bubble) => {
        const pl = this.players.find((pl) => pl.id === bubble.playerId);
        const st = this.players.find((pl) => pl.id === bubble.playerId);
        const fightProps =
          st === undefined
            ? { attackModifier: 1.0 }
            : skillTreeMethods.getAttackerModifier(st.skills, bubble, this);
        return {
          id: bubble.id,
          playerId: bubble.playerId,
          units: bubble.units,
          position: bubble.position,
          radius: bubble.radius,
          attackCombatAbilities: fightProps.attackModifier,
        };
      }),
    };
    return gs;
  }
}
