import { SendUnitsMove } from "../messages/replay/replay";
import { SpreadGameImplementation } from "../spreadGame";
import Cell from "../spreadGame/cell";
import { fight } from "../spreadGame/mechanics/commonMechanics";
import {
    bubbleFightUtils,
    cellFightUtils,
} from "../spreadGame/mechanics/events/fight";
import { availableAttackers, estimatedDefenders } from "./ai";
import { AttackerReducer } from "./greedyAi";
import { AttackerData, getAttackerData } from "./reach";
import { ReachableMap } from "./reachableMap";

export const isTarget = (
    game: SpreadGameImplementation,
    targetCellId: number,
    byPlayerId: number
) => {
    const remBubbles = game.bubbles.filter(
        (b) => b.targetId === targetCellId && b.playerId === byPlayerId
    );
    return remBubbles.length > 0;
};

export interface AttackerDataWithSenderId extends AttackerData {
    senderId: number;
}

interface AnalyzeHelper {
    currentAttackers: number;
    currentDefenders: number;
    senderIds: number[];
    durationInMs: number;
}

export interface AnalyzeResult {
    maximalPossibleAttackers: number;
    senderIds: number[];
    currentAttackers: number;
    overshot: number;
    durationInMs: number;
}

export const analyzeCapturePlan = (
    cells: Cell[],
    targetCell: Cell,
    reachMap: ReachableMap
): AnalyzeResult => {
    const attackerData = cells
        .flatMap((attackerCell) => {
            const r = reachMap.get(attackerCell.id, targetCell.id);
            if (r === null) return [];
            const att = availableAttackers(attackerCell);
            const realAtt = getAttackerData(att, r);
            const data: AttackerDataWithSenderId = {
                ...realAtt,
                senderId: attackerCell.id,
            };
            return [data];
        })
        .sort((data1, data2) => data1.durationInMs - data2.durationInMs);
    const totalAttackers = attackerData.reduce((prev, curr) => {
        return prev + curr.effectiveAttackers;
    }, 0);
    const analyzeData = attackerData.reduce(
        (prev: AnalyzeHelper, curr): AnalyzeHelper => {
            if (prev.currentAttackers > prev.currentDefenders) return prev;
            const defenders = estimatedDefenders(targetCell, curr.durationInMs);
            return {
                currentAttackers:
                    prev.currentAttackers + curr.effectiveAttackers,
                currentDefenders: defenders,
                senderIds: [...prev.senderIds, curr.senderId],
                durationInMs: curr.durationInMs,
            };
        },
        {
            currentAttackers: 0,
            currentDefenders: targetCell.units,
            senderIds: [],
            durationInMs: 0,
        }
    );
    const overshot = fight(
        analyzeData.currentAttackers,
        analyzeData.currentDefenders,
        bubbleFightUtils.default,
        cellFightUtils.default
    );
    return {
        maximalPossibleAttackers: totalAttackers,
        currentAttackers: analyzeData.currentAttackers,
        durationInMs: analyzeData.durationInMs,
        senderIds: analyzeData.senderIds,
        overshot: overshot,
    };
};
