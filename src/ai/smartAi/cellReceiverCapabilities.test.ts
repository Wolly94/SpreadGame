import { GameSettings } from "../../messages/inGame/gameServerMessages";
import SpreadReplay from "../../messages/replay/replay";
import { playersWithoutSkills } from "../../skilltree/perks/testHelper";
import { SpreadGameImplementation } from "../../spreadGame";
import { SpreadMap } from "../../spreadGame/map/map";
import { playerFromData } from "../../spreadGame/player";
import { ReachableImplementation } from "./../reachableMap";
import { CellReceiverCapabilityImplementation } from "./cellReceiverCapabilites";
import { CellSenderCapabilityImplementation } from "./cellSenderCapabilities";

const simpleMap: SpreadMap = {
    players: 2,
    height: 500,
    width: 500,
    cells: [
        {
            id: 0,
            playerId: 0,
            position: [100, 100],
            radius: 50,
            units: 30,
        },
        {
            id: 1,
            playerId: null,
            position: [400, 400],
            radius: 50,
            units: 10,
        },
        {
            id: 2,
            playerId: 1,
            position: [100, 400],
            radius: 40,
            units: 15,
        },
    ],
};
const gameSettings: GameSettings = {
    mechanics: "basic",
    updateFrequencyInMs: 25,
};

test("rec caps with no collisions", () => {
    const map = simpleMap;
    const game = new SpreadGameImplementation(
        simpleMap,
        gameSettings,
        playersWithoutSkills(2).map((data) => playerFromData(data))
    );
    const senderCaps = CellSenderCapabilityImplementation.fromGame(game);
    const reach = new ReachableImplementation(gameSettings, map, []);
    const recCaps = new CellReceiverCapabilityImplementation(
        reach,
        map.cells.map((c) => c.id),
        senderCaps
    );
    const receive0 = recCaps.get(0);
    const receive1 = recCaps.get(1);
    const receive2 = recCaps.get(2);
    expect(receive0.timeline.length).toBe(1);
    expect(receive1.timeline.length).toBe(2);
    expect(receive2.timeline.length).toBe(1);
});

test("rec caps with collisions and cell capture", () => {
    const rep: SpreadReplay = {
        gameSettings: gameSettings,
        lengthInMs: 10000,
        map: simpleMap,
        perks: [],
        players: playersWithoutSkills(2),
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 0,
                        senderIds: [0],
                        receiverId: 1,
                    },
                },
            },
            {
                timestamp: 500,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 0,
                        senderIds: [0],
                        receiverId: 2,
                    },
                },
            },
        ],
    };
    const game = SpreadGameImplementation.fromReplay(rep);
    game.runReplay(rep, 1000);
    const senderCaps = CellSenderCapabilityImplementation.fromGame(game);
    const reach = new ReachableImplementation(gameSettings, game.map, []);
    const recCaps = new CellReceiverCapabilityImplementation(
        reach,
        game.cells.map((c) => c.id),
        senderCaps
    );
    const receive0 = recCaps.get(0);
    const receive1 = recCaps.get(1);
    const receive2 = recCaps.get(2);
    expect(receive0.timeline.length).toBe(3);
    expect(receive1.timeline.length).toBe(3);
    expect(receive2.timeline.length).toBe(2);
});
