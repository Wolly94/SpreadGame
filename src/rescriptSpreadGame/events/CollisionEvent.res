type entity = C(Cell.cell) | B(Bubble.bubble)

type beforeBubbleCollision = {
  bubble: Bubble.bubble,
  other: Bubble.bubble,
}
type afterBubbleCollision = {
  bubble: option<Bubble.bubble>,
  other: option<Bubble.bubble>,
}

type beforeCellCollision = {
  bubble: Bubble.bubble,
  other: Cell.cell,
}
type afterCellCollision = {
  bubble: option<Bubble.bubble>,
  other: Cell.cell,
}

type beforeCollision =
  BeforeCellCollision(beforeCellCollision) | BeforeBubbleCollision(beforeBubbleCollision)

type collisionEvent =
  | BubbleCollision(beforeBubbleCollision, afterBubbleCollision)
  | CellCollision(beforeCellCollision, afterCellCollision)
