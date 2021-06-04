import Bubble from "../spreadGame/bubble";
import { ConquerCellProps, FightProps, SpreadGameImplementation } from "../spreadGame/spreadGame";
export interface GetFightProps {
    type: "FightEffect";
    getValue: (level: number, // level of perk
    attacker: Bubble, spreadGame: SpreadGameImplementation) => FightProps;
}
export interface GetConquerBubbleProps {
    type: "ConquerBubble";
    getValue: (level: number) => ConquerCellProps;
}
export declare type PerkEffect = GetFightProps | GetConquerBubbleProps;
