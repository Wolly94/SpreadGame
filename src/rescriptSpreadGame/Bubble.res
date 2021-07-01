@genType
type bubble = {
  id: int,
  ownerId: int,
  units: float,
  radius: float,
  position: Vector2D.vector,
  direction: Direction2D.direction,
  targetCellId: int,
  targetCellPosition: Vector2D.vector,
}
