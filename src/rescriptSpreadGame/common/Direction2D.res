type direction = {
    angle: float
}

let eucl = (direction): (float, float) => {
    (Js.Math.cos(direction.angle), Js.Math.sin(direction.angle))
}

let toVector = (direction): Vector2D.vector => {
    let (x, y) = eucl(direction)
    Vector2D.new(x, y)
}