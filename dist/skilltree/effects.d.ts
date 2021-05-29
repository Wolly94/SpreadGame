import Bubble from "../spreadGame/bubble";
import { FightProps, SpreadGameImplementation } from "../spreadGame/spreadGame";
export interface GetFightProps {
    type: "FightEffect";
    getValue: (level: number, // level of perk
    attacker: Bubble, spreadGame: SpreadGameImplementation) => FightProps;
}
export declare type PerkEffect = GetFightProps;
