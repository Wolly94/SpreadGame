import { SpreadGameImplementation } from "../../spreadGame";
import Cell from "../../spreadGame/cell";
import { availableAttackers } from "../ai";
import { ReachableMap } from "../reachableMap";
import { FutureCell } from "./futureCells";

interface SenderInfo {
    cellId: number;
    units: number;
    durationInMs: number;
}

export interface CellAccessibility {
    receiverId: number;
    receivable: SenderInfo[];
}

export const evalAccessibility = (
    senderInfos: SenderInfo[],
    receiver: FutureCell
) => {
    senderInfos.sort((si1, si2) => si1.durationInMs-si2.durationInMs)
};

export const getAccessibility = (
    game: SpreadGameImplementation,
    receiverId: number,
    reachable: ReachableMap
) => {
    const receiver = game.cells.find((c) => c.id === receiverId);
    if (receiver === undefined) return null;
    const senderInfos: SenderInfo[] = game.cells.flatMap((sender) => {
        const r = reachable.get(sender.id, receiver.id);
        if (r === null) return [];
        let attackers = availableAttackers(sender);
        if (attackers === 0) return []
        return [
            {
                cellId: sender.id,
                durationInMs: r.durationInMs,
                units: attackers,
            },
        ];
    });
    return { receiverId: receiverId, senderInfos: senderInfos };
};
