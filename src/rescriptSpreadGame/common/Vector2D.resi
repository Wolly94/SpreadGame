@genType
type vector

let new: (float, float) => vector
let eucl: vector => (float, float)
let add: (vector, vector) => vector
let mul: (vector, vector) => float
let scalarMul: (vector, float) => vector
let distance: (vector, vector) => float
let zero: vector
