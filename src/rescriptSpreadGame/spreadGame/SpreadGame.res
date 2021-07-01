module SpreadGame = (Mechs: Mechanics.GameMechanics) => {
  include SpreadGameCollisions.SpreadGameCollisions(Mechs)

  let handleCollision = (beforeCollision: CollisionEvent.beforeCollision) => {
    None
  }

  let rec handleCollisions = (bubbles, cells) => {
    let coll = getCollision(bubbles, cells)
    switch coll {
    | Some(beforeColl) => {
        let afterCollision = handleCollision(beforeColl)
        let (newBubbles, newCells) = ([], [])
        handleCollisions(newBubbles, newCells)
      }
    | None => (bubbles, cells)
    }
  }

  let step = (state: SpreadGameState.gameState, timeInMs: float): (
    SpreadGameState.gameState,
    array<CollisionEvent.collisionEvent>,
  ) => {
    let newCells = Js.Array.map(cell => {
      Mechs.grow(cell, timeInMs)
    }, state.cells)
    let newBubbles = Js.Array.map(bubble => {
      Mechs.move(bubble, timeInMs)
    }, state.bubbles)

    let (newBubbles, processedBubbleCollisions) = collideBubbles(newBubbles)
    let (newBubbles, newCells, processedCellCollisions) = collideCells(newBubbles, newCells)
    (
      {cells: newCells, bubbles: newBubbles},
      Js.Array.concat(processedBubbleCollisions, processedCellCollisions),
    )
  }
}
