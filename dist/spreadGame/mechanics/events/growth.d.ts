import Cell from "../../cell";
import { Effect, PropUtils } from "./definitions";
export interface GrowthEvent {
    type: "Growth";
    cell: Cell;
}
export interface GrowthProps {
    type: GrowthEvent["type"];
    additionalCapacity: number;
    additionalGrowthInPercent: number;
}
export interface GrowthEffect extends Effect<GrowthEvent> {
    type: GrowthEvent["type"];
}
export declare const growthUtils: PropUtils<GrowthProps>;
