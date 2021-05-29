import Bubble from "./bubble";
import { radiusToGrowth, radiusToUnits } from "./common";

interface Cell {
  id: number;
  playerId: number | null;
  position: [number, number];
  radius: number;
  units: number;
}

export default Cell;
