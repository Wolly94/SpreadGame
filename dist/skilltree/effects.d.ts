import Bubble from "../spreadGame/bubble";
import Cell from "../spreadGame/cell";
import { SpreadGameImplementation } from "../spreadGame/spreadGame";
import { AttackerFightProps, ConquerCellProps, DefendCellProps, DefenderFightProps } from "../spreadGame/spreadGameProps";
export interface GetAttackerFightProps {
    type: "AttackerFightEffect";
    getValue: (level: number, // level of perk
    attacker: Bubble, spreadGame: SpreadGameImplementation, defender: Cell | Bubble | null) => AttackerFightProps;
}
export interface GetDefenderFightProps {
    type: "DefenderFightEffect";
    getValue: (level: number, // level of perk
    defender: Cell, spreadGame: SpreadGameImplementation, attacker: Bubble | null) => DefenderFightProps;
}
export interface GetConquerCellProps {
    type: "ConquerCellEffect";
    getValue: (level: number) => ConquerCellProps;
}
export interface GetDefendCellProps {
    type: "DefendCellEffect";
    getValue: (level: number) => DefendCellProps;
}
export declare type PerkEffect = GetAttackerFightProps | GetDefenderFightProps | GetConquerCellProps | GetDefendCellProps;
