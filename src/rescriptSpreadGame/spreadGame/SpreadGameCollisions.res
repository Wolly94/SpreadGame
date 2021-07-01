module SpreadGameCollisions = (Mechs: Mechanics.GameMechanics) => {
  let getCollision = (bubbles: array<Bubble.bubble>, cells: array<Cell.cell>): option<
    CollisionEvent.beforeCollision,
  > => {
    let bubbleCollision = ArrayMethods.findAndMapi((b1, index) => {
      let ob2 = Js.Array.find(
        b2 => Mechs.bubbleCollision(b1, b2),
        Js.Array.slice(~start=0, ~end_=index, bubbles),
      )
      Belt.Option.map(ob2, b2 => CollisionEvent.BeforeBubbleCollision({bubble: b1, other: b2}))
    }, bubbles)

    if Belt.Option.isSome(bubbleCollision) {
      bubbleCollision
    } else {
      let cellCollision = ArrayMethods.findAndMap(bubble => {
        let oc = Js.Array.find(cell => Mechs.cellCollision(bubble, cell), cells)
        Belt.Option.map(oc, cell => CollisionEvent.BeforeCellCollision({
          bubble: bubble,
          other: cell,
        }))
      }, bubbles)
      cellCollision
    }
  }

  let collideBubbles = (bubbles: array<Bubble.bubble>): (
    array<Bubble.bubble>,
    array<CollisionEvent.collisionEvent>,
  ) => {
    let collisionEvents: array<CollisionEvent.collisionEvent> = []

    let newBubbles = Js.Array.reduce((survivors: array<Bubble.bubble>, bubbleToAdd) => {
      let (newSurvivors, currentBubble) = Js.Array.reduce(
        ((prevSurvivors, newCurrentBubble), newSurvivor) => {
          switch newCurrentBubble {
          | Some(currBubble) =>
            if Mechs.bubbleCollision(newSurvivor, currBubble) {
              let (newCurrBubble, newRemBubble) = Mechs.collideBubble(currBubble, newSurvivor)
              let collisionEvent: CollisionEvent.collisionEvent = BubbleCollision(
                {bubble: currBubble, other: newSurvivor},
                {bubble: newCurrBubble, other: newRemBubble},
              )
              let _ = Js.Array.push(collisionEvent, collisionEvents)
              switch newRemBubble {
              | Some(b) => (Js.Array.concat(prevSurvivors, [b]), newCurrBubble)
              | None => (prevSurvivors, newCurrBubble)
              }
            } else {
              (Js.Array.concat(prevSurvivors, [newSurvivor]), Some(currBubble))
            }
          | None => (Js.Array.concat(prevSurvivors, [newSurvivor]), newCurrentBubble)
          }
        },
        ([], Some(bubbleToAdd)),
        survivors,
      )
      switch currentBubble {
      | Some(newB) => Js.Array.concat(newSurvivors, [newB])
      | None => newSurvivors
      }
    }, [], bubbles)
    (newBubbles, collisionEvents)
  }

  let collideCells = (bubbles: array<Bubble.bubble>, cells: array<Cell.cell>): (
    array<Bubble.bubble>,
    array<Cell.cell>,
    array<CollisionEvent.collisionEvent>,
  ) => {
    let collisionEvents: array<CollisionEvent.collisionEvent> = []

    let (newBubbles, newCells) = Js.Array.reduce(((remainingBubbles, newCells), newBubble) => {
      let (remBubble, futureCells) = Js.Array.reduce(((currentBubble, processedCells), cell) => {
        switch currentBubble {
        | Some(currBubble) =>
          if Mechs.cellCollision(currBubble, cell) {
            let (newB, newC) = Mechs.collideCell(currBubble, cell)
            let collisionEvent: CollisionEvent.collisionEvent = CellCollision(
              {bubble: currBubble, other: cell},
              {bubble: newB, other: cell},
            )
            let _ = Js.Array.push(collisionEvent, collisionEvents)
            (newB, Belt.Array.concat(processedCells, [newC]))
          } else {
            (Some(currBubble), Belt.Array.concat(processedCells, [cell]))
          }
        | None => (None, Belt.Array.concat(processedCells, [cell]))
        }
      }, (Some(newBubble), []), newCells)
      switch remBubble {
      | Some(bubble) => (Belt.Array.concat(remainingBubbles, [bubble]), futureCells)
      | None => (remainingBubbles, futureCells)
      }
    }, ([], cells), bubbles)

    (newBubbles, newCells, collisionEvents)
  }
}
