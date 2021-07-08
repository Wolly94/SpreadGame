import { HistoryEntry } from "../../messages/replay/replay";
import { CollisionEvent, getFinishTime } from "../../skilltree/events";
import { SpreadGameImplementation } from "../../spreadGame";
import Cell from "../../spreadGame/cell";
import { availableAttackers } from "../ai";

export interface UnitsSent {
    senderPlayerId: number;
    senderCellId: number;
    availableAttackers: number;
    earliestPossibleTimeInMs: number;
    latestPossibleTimeInMs: number | null;
}

export interface CellImpactData {
    timeline: UnitsSent[];
}

export interface CellSenderCapabilities {
    get: (senderId: number) => CellImpactData | null;
    set: (senderId: number, imp: CellImpactData) => void;
}

export class CellSenderCapabilityImplementation
    implements CellSenderCapabilities
{
    store: { senderId: number; impact: CellImpactData }[];
    static fromGame(game: SpreadGameImplementation): CellSenderCapabilities {
        const copied = game.copy();
        while (copied.bubbles.length > 0) {
            copied.step(game.gameSettings.updateFrequencyInMs);
        }
        const collisionEvents = copied.eventHistory.filter(
            (ev): ev is HistoryEntry<CollisionEvent> =>
                ev.data.type === "CollisionEvent"
        );
        const senderCaps = new CellSenderCapabilityImplementation(
            collisionEvents,
            game.cells,
            game.timePassed
        );
        return senderCaps;
    }
    constructor(
        collisionEvents: HistoryEntry<CollisionEvent>[],
        cells: Cell[],
        timePassedInMs: number
    ) {
        this.store = [];
        cells.forEach((sender) => {
            const timeline: UnitsSent[] = [];
            if (sender.playerId !== null) {
                timeline.push({
                    senderCellId: sender.id,
                    senderPlayerId: sender.playerId,
                    earliestPossibleTimeInMs: timePassedInMs,
                    latestPossibleTimeInMs: null,
                    availableAttackers: availableAttackers(sender),
                });
            }
            collisionEvents.forEach((ev) => {
                if (
                    ev.data.after.other.type !== "Cell" ||
                    ev.data.after.other.val.id !== sender.id
                )
                    return;
                const newOwnerId = ev.data.after.other.val.playerId;
                if (newOwnerId === null) return;
                const finishTime = getFinishTime(ev.data);
                if (finishTime === null) return;
                const sendableUnits = availableAttackers(
                    ev.data.after.other.val
                );
                if (timeline.length > 0) {
                    // set latest possible time to the starting time of the event
                    timeline[timeline.length - 1].latestPossibleTimeInMs =
                        ev.timestamp;
                }
                timeline.push({
                    availableAttackers: sendableUnits,
                    senderCellId: sender.id,
                    senderPlayerId: newOwnerId,
                    earliestPossibleTimeInMs: finishTime,
                    latestPossibleTimeInMs: null,
                });
            });
            this.set(sender.id, { timeline: timeline });
        });
    }
    get(senderId: number) {
        const res = this.store.find((val) => val.senderId === senderId);
        if (res === undefined) return null;
        else return res.impact;
    }
    set(senderId: number, imp: CellImpactData) {
        const index = this.store.findIndex((val) => val.senderId === senderId);
        const val = {
            senderId: senderId,
            impact: imp,
        };
        if (index < 0) this.store.push(val);
        else this.store[index] = val;
    }
}
