export interface LostCellEvent {
    type: "LostCell";
    cellId: number;
    oldPlayerId: number;
    newPlayerId: number;
}
export declare type SpreadGameEvent = LostCellEvent;
