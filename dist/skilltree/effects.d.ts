import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { ConquerCellProps, AttackerFightProps, SpreadGameImplementation } from "../spreadGame/spreadGame";
export interface GetAttackerFightProps {
    type: "FightEffect";
    getValue: (level: number, // level of perk
    attacker: Bubble, spreadGame: SpreadGameImplementation) => AttackerFightProps;
}
export interface GetDefenderFightProps {
    type: "DefenderFightEffect";
    getValue: (level: number, // level of perk
    defender: Cell, spreadGame: SpreadGameImplementation) => AttackerFightProps;
}
export interface GetConquerBubbleProps {
    type: "ConquerBubble";
    getValue: (level: number) => ConquerCellProps;
}
export declare type PerkEffect = GetAttackerFightProps | GetDefenderFightProps | GetConquerBubbleProps;
