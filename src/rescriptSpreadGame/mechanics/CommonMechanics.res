open Cell
open Bubble

// units ~ radius^2 where 50 ~ 50
let radiusToUnitsFixPoint = Belt.Float.fromInt(50)
let radiusToUnits = (radius: float): float => {
  if radius <= 0. {
    0.
  } else {
    radius ** 2. /. radiusToUnitsFixPoint
  }
}
let unitsToRadius = (units: float): float => {
  if units <= 0. {
    0.
  } else {
    Js.Math.sqrt(units *. radiusToUnitsFixPoint)
  }
}

// radius ~ units/second
// 50 ~ 1
let unitGrowthRadius = 50.
let radiusToGrowthPerSecond = (radius: float): float => {
  radius /. unitGrowthRadius
}

let grow = (cell: cell, timeInMs: float) => {
  let unitInc = radiusToGrowthPerSecond(cell.radius) *. 1000. /. timeInMs
  let newUnits = cell.units +. unitInc
  {...cell, units: newUnits}
}

let move = (bubble: bubble) => {
  bubble
}

let defaultBubbleSpeedInPixelPerSecond = 90.
