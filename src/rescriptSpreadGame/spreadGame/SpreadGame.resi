module SpreadGame: Mechanics.GameMechanics =>
{
  let step: (
    SpreadGameState.gameState,
    float,
  ) => (SpreadGameState.gameState, array<CollisionEvent.collisionEvent>)
}
