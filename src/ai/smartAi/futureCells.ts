import { HistoryEntry } from "../../messages/replay/replay";
import { SpreadGameImplementation } from "../../spreadGame";
import Cell from "../../spreadGame/cell";
import { cellFighters } from "../../spreadGame/mechanics/scrapeOffMechanics";

export type FutureCell = HistoryEntry<{
    cell: Cell;
    lastCapture: { cell: Cell; timePassedInMs: number } | null;
}>;

export const prioritizeCells = (
    game: SpreadGameImplementation,
    playerId: number
) => {
    const forecast = getForecast(game);
    const end = forecastEnd(forecast);
};

export const forecastEnd = (
    cellChanges: HistoryEntry<Cell>[]
): FutureCell[] => {
    const latestCells: FutureCell[] = [];
    cellChanges.forEach((hc) => {
        const index = latestCells.findIndex(
            (c) => c.data.cell.id === hc.data.id
        );
        if (index < 0) {
            latestCells.push({
                timestamp: hc.timestamp,
                data: { cell: hc.data, lastCapture: null },
            });
        } else {
            if (latestCells[index].data.cell.playerId !== hc.data.playerId) {
                latestCells[index] = {
                    timestamp: hc.timestamp,
                    data: {
                        cell: hc.data,
                        lastCapture: {
                            cell: { ...hc.data },
                            timePassedInMs: hc.timestamp,
                        },
                    },
                };
            } else {
                latestCells[index].timestamp = hc.timestamp;
                latestCells[index].data.cell = hc.data;
            }
        }
    });
    return latestCells;
};

export const getForecast = (
    game: SpreadGameImplementation
): HistoryEntry<Cell>[] => {
    const cellChanges: HistoryEntry<Cell>[] = [];
    const copied = game.copy();
    var currentBubbles = copied.bubbles;
    var timePassedUntilNow = game.timePassed;
    while (copied.bubbles.length > 0) {
        copied.step(copied.gameSettings.updateFrequencyInMs);
        if (currentBubbles.length !== copied.bubbles.length) {
            const terminatedBubbles = currentBubbles.filter(
                (backedUp) => !copied.bubbles.some((b) => b.id === backedUp.id)
            );
            const cellsChangedNow: Cell[] = terminatedBubbles.flatMap(
                (bubble) => {
                    return game.eventHistory.flatMap((ev) => {
                        if (
                            ev.data.type === "CollisionEvent" &&
                            ev.data.before.bubble.id === bubble.id &&
                            ev.data.after.other.type === "Cell"
                        ) {
                            return [ev.data.after.other.val];
                        } else return [];
                    });
                }
            );
            cellsChangedNow.forEach((chn) =>
                cellChanges.push({
                    timestamp: copied.timePassed - timePassedUntilNow,
                    data: chn,
                })
            );

            currentBubbles = copied.bubbles;
        }
    }
    return cellChanges;
};
