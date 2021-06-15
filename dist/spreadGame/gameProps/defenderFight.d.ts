import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { Effect, PropUtils } from "./definitions";
export declare const isDefenderFightProps: (props: any) => props is DefenderFightProps;
export interface DefenderFightProps {
    combatAbilityModifier: number;
    membraneAbsorption: number;
}
export interface DefenderFightTrigger {
    attacker: Bubble | null;
    defender: Cell;
}
export interface DefenderFightEffect extends Effect<DefenderFightProps, DefenderFightTrigger> {
    type: "DefenderFightEffect";
    getValue: (level: number, // level of perk
    trigger: DefenderFightTrigger, spreadGame: SpreadGameImplementation) => DefenderFightProps;
}
export declare const defenderFightUtils: PropUtils<DefenderFightProps, DefenderFightTrigger>;
