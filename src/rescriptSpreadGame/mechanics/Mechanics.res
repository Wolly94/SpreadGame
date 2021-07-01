module type CollisionMechanics = {
  open Bubble
  open Cell
  let bubbleCollision: (bubble, bubble) => bool
  let cellCollision: (bubble, cell) => bool

  let collideBubble: (bubble, bubble) => (option<bubble>, option<bubble>)
  let collideCell: (bubble, cell) => (option<bubble>, cell)
}

module type GrowthMechanics = {
  let grow: (Cell.cell, float) => Cell.cell
}

module type MoveMechanics = {
  let move: (Bubble.bubble, float) => Bubble.bubble
}

module type GameMechanics = {
  include CollisionMechanics
  include GrowthMechanics
  include MoveMechanics
}
