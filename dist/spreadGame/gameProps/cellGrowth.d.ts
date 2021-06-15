import { SpreadGameImplementation } from "..";
import { Effect, PropUtils } from "./definitions";
export interface DefenderGrowthProps {
    additionalCapacity: number;
    additionalGrowthInPercent: number;
}
export interface DefenderGrowthTrigger {
}
export interface DefenderGrowthEffect extends Effect<DefenderGrowthProps, DefenderGrowthTrigger> {
    type: "DefenderGrowthEffect";
    getValue: (level: number, // level of perk
    trigger: DefenderGrowthTrigger, spreadGame: SpreadGameImplementation) => DefenderGrowthProps;
}
export declare const growthUtils: PropUtils<DefenderGrowthProps, DefenderGrowthTrigger>;
