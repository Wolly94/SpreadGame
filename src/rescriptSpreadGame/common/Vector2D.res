type vector = (float, float)

let new = (x: float, y: float): vector => (x, y)
let eucl = v => {
  let (x1, y1) = v
  (x1, y1)
}
let add = (v1, v2): vector => {
  let (x1, y1) = eucl(v1)
  let (x2, y2) = eucl(v2)
  (x1 +. x2, y1 +. y2)
}
let sub = (v1, v2): vector => {
  let (x1, y1) = eucl(v1)
  let (x2, y2) = eucl(v2)
  (x1 -. x2, y1 -. y2)
}
let mul = (v1, v2): float => {
  let (x1, y1) = eucl(v1)
  let (x2, y2) = eucl(v2)
  x1 *. x2 +. y1 *. y2
}
let scalarMul = (v1, a): vector => {
  let (x1, y1) = eucl(v1)
  new(x1 *. a, y1 *. a)
}
let length = (v: vector) => {
  Js.Math.sqrt(mul(v, v))
}
let distance = (v1, v2): float => {
  length(sub(v1, v2))
}
let zero: vector = new(Belt.Int.toFloat(0), Belt.Int.toFloat(0))
