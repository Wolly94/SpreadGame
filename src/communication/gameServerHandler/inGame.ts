import { GreedyAi } from "../../ai/ai";
import AiClient from "../../ai/aiClient";
import { ClientInGameMessage } from "../../messages/inGame/clientInGameMessage";
import {
  GameSettings,
  GameStateMessage,
  GameServerMessage,
  LobbyStateMessage,
  SetPlayerIdMessage,
  ClientLobbyPlayer,
  ClientAiPlayer,
  ClientHumanPlayer,
  ClientObserver,
} from "../../messages/inGame/gameServerMessages";
import { GetReplayMessage } from "../../messages/replay/clientReplayMessages";
import {
  HistoryEntry,
  Move,
  SendUnitsMove,
} from "../../messages/replay/replay";
import { SendReplayMessage } from "../../messages/replay/serverReplayMessages";
import { Player, SpreadGameImplementation } from "../../spreadGame";
import { SpreadMap } from "../../spreadGame/map/map";
import { SpreadGame } from "../../spreadGame/spreadGame";
import { SeatedPlayer, AiPlayer, idFromToken, PlayerData } from "./common";

const updateFrequencyInMs = 20;

interface InGameState {
  type: "ingame";
  map: SpreadMap;
  gameSettings: GameSettings;
  seatedPlayers: SeatedPlayer[];
  aiClients: AiClient[]; // last reference to these clients, to be deleted when finishing game
  gameState: SpreadGame;
  intervalId: NodeJS.Timeout | null;
}

interface InGameFunctions {
  startGame: (updateCallback: (msg: GameStateMessage) => void) => void;
  stop: () => void;
  onReceiveMessage: (
    token: string,
    message: ClientInGameMessage | GetReplayMessage
  ) => SendReplayMessage | null;
  onConnect: (
    token: string,
    playerData: PlayerData
  ) => [boolean, GameServerMessage | null, LobbyStateMessage | null];
}

export type InGame = InGameState & InGameFunctions;

class InGameImplementation implements InGame {
  type: "ingame" = "ingame";
  map: SpreadMap;
  gameSettings: GameSettings;
  seatedPlayers: SeatedPlayer[];
  aiClients: AiClient[];
  gameState: SpreadGame;
  intervalId: NodeJS.Timeout | null;
  moveHistory: HistoryEntry<Move>[];

  constructor(
    map: SpreadMap,
    settings: GameSettings,
    seatedPlayers: SeatedPlayer[]
  ) {
    this.intervalId = null;
    this.map = map;
    this.gameSettings = settings;
    const players: Player[] = seatedPlayers.map((sp) => {
      return { id: sp.playerId, skills: sp.skilledPerks };
    });
    if (settings.mechanics === "basic") {
      this.gameState = new SpreadGameImplementation(map, settings, players);
    } else if (settings.mechanics === "scrapeoff") {
      this.gameState = new SpreadGameImplementation(map, settings, players);
    } else if (settings.mechanics === "bounce") {
      this.gameState = new SpreadGameImplementation(map, settings, players);
    } else throw Error("unregistered mechanics");
    this.moveHistory = [];
    this.seatedPlayers = seatedPlayers;

    this.aiClients = this.seatedPlayers
      .filter((sp): sp is AiPlayer => {
        return sp.type === "ai";
      })
      .map((sp) => {
        const ai = new GreedyAi();
        const aiClient = new AiClient(sp.playerId, ai);
        return aiClient;
      });
  }

  isRunning() {
    return this.intervalId !== null;
  }

  stop() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  onConnect(
    token: string,
    playerData: PlayerData
  ): [boolean, GameServerMessage | null, LobbyStateMessage | null] {
    let updateAll = false;
    let toSender: GameServerMessage | null = null;
    const index = this.seatedPlayers.findIndex(
      (sp) => sp.type === "human" && sp.token === token
    );
    if (index < 0) {
      updateAll = false;
    } else {
      updateAll = true;
      const playerIdMessage: SetPlayerIdMessage = {
        type: "playerid",
        data: {
          playerId: index >= 0 ? this.seatedPlayers[index].playerId : null,
        },
      };
      toSender = playerIdMessage;
    }
    const players: ClientLobbyPlayer[] = this.seatedPlayers.map((sp) => {
      if (sp.type === "ai") {
        const aip: ClientAiPlayer = {
          type: "ai",
          playerId: sp.playerId,
        };
        return aip;
      } else {
        const clp: ClientHumanPlayer = {
          type: "human",
          name: sp.playerData.name,
          playerId: sp.playerId,
        };
        return clp;
      }
    });
    const observers: ClientObserver[] = [];
    const lobbyStateMessage: LobbyStateMessage = {
      type: "lobbystate",
      data: {
        map: this.map,
        players: players,
        observers: observers,
        gameSettings: this.gameSettings,
      },
    };
    return [updateAll, toSender, lobbyStateMessage];
  }

  onReceiveMessage(
    token: string,
    message: ClientInGameMessage | GetReplayMessage
  ): SendReplayMessage | null {
    if (message.type === "sendunits" && this.isRunning()) {
      const playerId = idFromToken(token, this.seatedPlayers);
      if (playerId != null) {
        const value = message.data;
        const move: SendUnitsMove = {
          type: "sendunitsmove",
          data: {
            playerId: playerId,
            senderIds: value.senderIds,
            receiverId: value.receiverId,
          },
        };
        this.gameState.applyMove(move);
        console.log("message received and attack sent: " + message);
      }
      return null;
    } else if (message.type === "getreplay") {
      const rep = this.gameState.getReplay();
      const mess: SendReplayMessage = {
        type: "sendreplay",
        data: rep,
      };
      return mess;
    } else return null;
  }

  startGame(updateCallback: (msg: GameStateMessage) => void) {
    const ms = updateFrequencyInMs;
    this.intervalId = setInterval(() => {
      if (this.gameState !== null) {
        this.gameState.step(ms);
        updateCallback(this.getGameStateMessage());
        this.applyAiMoves();
      }
    }, ms);
  }

  applyAiMoves() {
    const data = this.gameState.toClientGameState();
    this.aiClients.forEach((aiCl) => {
      const move = aiCl.getMove(data);
      if (move != null) {
        this.gameState.applyMove(move);
      }
    });
  }

  getGameStateMessage(): GameStateMessage {
    const data = this.gameState.toClientGameState();
    const message: GameStateMessage = {
      type: "gamestate",
      data: data,
    };
    return message;
  }
}

export default InGameImplementation;
