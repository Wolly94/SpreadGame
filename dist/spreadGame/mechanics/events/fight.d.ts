import { BeforeFightState } from "../../../skilltree/events";
import { Effect, PropUtils } from "./definitions";
export interface BubbleFightProps {
    type: "BubbleFightProps";
    combatAbilityModifier: number;
}
export declare const bubbleFightUtils: PropUtils<BubbleFightProps>;
export interface CellFightProps {
    type: "CellFightProps";
    combatAbilityModifier: number;
    membraneAbsorption: number;
}
export declare const cellFightUtils: PropUtils<CellFightProps>;
export declare const isCellFightProps: (props: any) => props is CellFightProps;
export interface BeforeFightEvent {
    type: "BeforeFightEvent";
    before: BeforeFightState;
}
export interface BeforeFightEffect extends Effect<BeforeFightEvent> {
    type: BeforeFightEvent["type"];
}
