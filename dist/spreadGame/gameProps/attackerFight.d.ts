import Bubble from "../bubble";
import Cell from "../cell";
import { SpreadGameImplementation } from "../spreadGame";
import { PropUtils } from "./definitions";
export interface AttackerFightProps {
    combatAbilityModifier: number;
}
export interface AttackerFightTrigger {
    attacker: Bubble;
    defender: Bubble | Cell | null;
}
export interface AttackerFightEffect {
    type: "AttackerFightEffect";
    getValue: (level: number, // level of perk
    trigger: AttackerFightTrigger, spreadGame: SpreadGameImplementation) => AttackerFightProps;
}
export declare const attackerFightUtils: PropUtils<AttackerFightProps, AttackerFightTrigger>;
