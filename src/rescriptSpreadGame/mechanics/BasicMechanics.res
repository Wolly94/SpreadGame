module BasicCollisionMechanics: Mechanics.CollisionMechanics = {
  open Bubble
  let bubbleCollision = (b1: bubble, b2: bubble) => {
    open Vector2D
    let dist = distance(b1.position, b2.position)
    dist <= Js.Math.min_float(b1.radius, b2.radius)
  }
  let cellCollision = (b1: bubble, c: Cell.cell) => {
    open Vector2D
    let dist = distance(b1.position, c.position)
    dist <= Js.Math.min_float(b1.radius, c.radius)
  }

  let collideBubble = (b1, b2) => (Some(b1), Some(b2))
  let collideCell = (bubble, cell) => (Some(bubble), cell)
}

module BasicGrowthMechanics: Mechanics.GrowthMechanics = {
  let grow = (cell: Cell.cell, timeInMs: float) => {
    let capacity = CommonMechanics.radiusToUnits(cell.radius)
    let unitInc = CommonMechanics.radiusToGrowthPerSecond(cell.radius) *. timeInMs /. 1000.
    let newUnits = switch capacity >= cell.units {
    | true => Js.Math.min_float(capacity, cell.units +. unitInc)
    | false => Js.Math.max_float(capacity, cell.units -. unitInc)
    }
    {...cell, units: newUnits}
  }
}

module BasicMoveMechanics: Mechanics.MoveMechanics = {
  let move = (bubble: Bubble.bubble, timeInMs: float) => {
    open Vector2D
    let travelDist = CommonMechanics.defaultBubbleSpeedInPixelPerSecond *. timeInMs /. 1000.
    let positionInc = scalarMul(Direction2D.toVector(bubble.direction), travelDist)
    let newPosition = add(bubble.position, positionInc)
    {...bubble, position: newPosition}
  }
}

include BasicCollisionMechanics
include BasicGrowthMechanics
include BasicMoveMechanics
