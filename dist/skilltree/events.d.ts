import { HistoryEntry } from "../messages/replay/replay";
import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
export interface CollisionData {
    unitsLost: number;
    position: [number, number];
    beforePlayerId: number | null;
    afterPlayerId: number | null;
}
export interface PartialCollision {
    bubble: CollisionData;
    other: CollisionData;
}
export declare type BeforeCollisionOtherState = {
    type: "Bubble";
    val: Bubble;
} | {
    type: "Cell";
    val: Cell;
};
export interface BeforeCollisionState {
    bubble: Bubble;
    other: BeforeCollisionOtherState;
}
export declare type AfterCollisionOtherState = {
    type: "Bubble";
    val: Bubble | null;
} | {
    type: "Cell";
    val: Cell;
};
export interface AfterCollisionState {
    bubble: Bubble | null;
    other: AfterCollisionOtherState;
}
export interface CollisionEvent {
    type: "CollisionEvent";
    before: BeforeCollisionState;
    after: AfterCollisionState;
    finished: boolean;
    partialCollisions: HistoryEntry<PartialCollision>[];
}
export declare const latestDistance: (event: CollisionEvent) => number;
export declare const collisionEventFinished: (event: CollisionEvent) => boolean;
export declare const finishCollisionEvent: (event: CollisionEvent) => CollisionEvent;
export declare const entitiesApproached: (before: PartialCollision, after: PartialCollision) => boolean;
export declare const createCollisionEvent: (beforeFight: BeforeCollisionState, afterFight: AfterCollisionState, timePassed: number) => CollisionEvent;
export declare const combinedCollisionEvents: (collisionEvent: CollisionEvent, beforeCollision: BeforeCollisionState, afterCollision: AfterCollisionState, timePassed: number) => boolean;
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
export declare const getCapturedCellEvent: (beforeCollision: BeforeCollisionState, afterCollision: AfterCollisionState) => CapturedCellEvent | null;
export interface ReinforcedCellEvent {
    type: "ReinforcedCell";
    bubbleId: number;
    cellId: number;
    playerId: number;
    unitsTransferred: number;
    collisionEvent: CollisionEvent;
}
export interface DefendedCellEvent {
    type: "DefendedCell";
    bubbleId: number;
    cellId: number;
    defenderPlayerId: number | null;
    attackerPlayerId: number;
    unitsDefeated: number;
    collisionEvent: CollisionEvent;
}
export interface DefeatedBubbleEvent {
    type: "DefeatedBubble";
    unitsDefeated: number;
    defeaterPlayerId: number | null;
    other: AfterCollisionOtherState;
    collisionEvent: CollisionEvent;
}
export declare const getDefendedCellEvent: (event: CollisionEvent) => HistoryEntry<DefendedCellEvent> | null;
export declare const getReinforcedCellEvent: (event: CollisionEvent) => HistoryEntry<ReinforcedCellEvent> | null;
export declare const getDefeatedBubbleEvents: (event: CollisionEvent) => DefeatedBubbleEvent[];
export declare type SpreadGameEvent = CollisionEvent | SendBubbleEvent | CapturedCellEvent | ReinforcedCellEvent | DefeatedBubbleEvent;
export declare type CollisionEnd = DefeatedBubbleEvent | ReinforcedCellEvent | DefendedCellEvent;
