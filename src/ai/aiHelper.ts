import { SpreadGameImplementation } from "../spreadGame";

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
