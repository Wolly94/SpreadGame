export interface LostCellEvent {
    type: "LostCell";
    cellId: number;
    playerId: number;
    opponentPlayerId: number;
    opponentBubbleId: number;
}
export interface LostBubbleEvent {
    type: "LostBubble";
    playerId: number;
    opponentPlayerId: number;
    opponentBubbleId: number;
}
export declare type FightResultEvent = LostCellEvent | LostBubbleEvent;
export declare type SpreadGameEvent = FightResultEvent;
