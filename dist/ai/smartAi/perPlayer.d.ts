export interface PerPlayer<TData> {
    get: (playerId: number) => TData | null;
    set: (playerId: number, data: TData) => void;
}
export declare class PerPlayerImplementation<TData> implements PerPlayer<TData> {
    store: {
        playerId: number;
        data: TData;
    }[];
    constructor();
    get(playerId: number): TData | null;
    set(playerId: number, data: TData): void;
}
