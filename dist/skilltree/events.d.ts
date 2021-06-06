import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
export interface FightData {
    unitsLost: number;
    position: [number, number];
    currentPlayerId: number | null;
}
export interface PartialFight {
    attacker: FightData;
    defender: FightData;
}
export interface BeforeFightState {
    attacker: Bubble;
    defender: {
        type: "Bubble";
        val: Bubble;
    } | {
        type: "Cell";
        val: Cell;
    };
}
export declare type AfterFightDefenderState = {
    type: "Bubble";
    val: Bubble | null;
} | {
    type: "Cell";
    val: Cell;
};
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
export declare const latestDistance: (event: FightEvent) => number;
export declare const fightEventFinished: (event: FightEvent) => boolean;
export declare const finishFightEvent: (event: FightEvent) => FightEvent;
export declare const entitiesApproached: (before: PartialFight, after: PartialFight) => boolean;
export declare const createFightEvent: (beforeFight: BeforeFightState, afterFight: AfterFightState, timePassed: number) => FightEvent;
export declare const combinedFightEvents: (e1: FightEvent, beforeFight: BeforeFightState, afterFight: AfterFightState, timePassed: number) => boolean;
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
export declare type SpreadGameEvent = FightEvent | SendBubbleEvent | CapturedCellEvent | DefeatedBubbleEvent;
