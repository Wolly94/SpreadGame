type vector = (int, int)

let new = (x: int, y: int): vector => (x, y)
let add = (v1, v2): vector => {
    let (x1, y1) = v1
    let (x2, y2) = v2
    (x1+x2, y1+y2)
}