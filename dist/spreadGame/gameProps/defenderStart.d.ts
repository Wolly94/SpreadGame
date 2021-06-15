import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";
export interface DefenderStartProps {
    additionalUnits: number;
}
export interface DefenderStartTrigger {
}
export interface DefenderStartEffect extends Effect<DefenderStartProps, DefenderStartTrigger> {
    type: "DefenderStartEffect";
    getValue: (level: number, // level of perk
    trigger: DefenderStartTrigger, spreadGame: SpreadGameImplementation) => DefenderStartProps;
}
export declare const defenderStartUtils: PropUtils<DefenderStartProps, DefenderStartTrigger>;
