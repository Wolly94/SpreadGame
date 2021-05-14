export interface MapCell {
    id: number;
    playerId: number | null;
    position: [number, number];
    radius: number;
    units: number;
}
export interface SpreadMap {
    cells: MapCell[];
    players: number;
    width: number;
    height: number;
}
export declare const mapDefaults: {
    minRadius: number;
    width: number;
    height: number;
    maxPlayers: number;
};
export declare const distanceToBoundary: (map: SpreadMap, position: [number, number]) => number;
export declare const availableSpaceFromPosition: (map: SpreadMap, position: [number, number]) => number;
export declare const availableSpace: (map: SpreadMap, cell: MapCell) => number;
export declare const adjustCellValues: (map: SpreadMap, cell: MapCell) => "Radius too small!" | "Not enough space!" | null;
export declare const updateCellInMap: (cell: MapCell, map: SpreadMap) => {
    map: SpreadMap;
    error: string | null;
};
export declare const removeCellFromMap: (cellId: number, map: SpreadMap) => {
    cells: MapCell[];
    players: number;
    width: number;
    height: number;
};
export declare const addCellToMap: (cell: MapCell, map: SpreadMap) => {
    map: SpreadMap;
    error: string | null;
};
export declare const emptyMap: () => SpreadMap;
export declare const getPlayerIds: (map: SpreadMap) => Set<number>;
export declare const validateMap: (map: SpreadMap) => {
    map: {
        players: number;
        cells: MapCell[];
        width: number;
        height: number;
    };
    message: string;
};
