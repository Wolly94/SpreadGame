export interface ClientBubble {
    id: number;
    units: number;
    position: [number, number];
    playerId: number;
    radius: number;
    attackCombatAbilities: number;
}
export interface ClientCell {
    id: number;
    units: number;
    position: [number, number];
    playerId: number | null;
    radius: number;
    defenderCombatAbilities: number;
    attackerCombatAbilities: number;
}

export interface ClientGameState {
    timePassedInMs: number;
    cells: ClientCell[];
    bubbles: ClientBubble[];
}
