declare type PropUtils<T> = {
    combine: (a: T, b: T) => T;
    default: T;
};
export interface AttackerFightProps {
    combatAbilityModifier: number;
}
export declare const combineAttackerFightProps: PropUtils<AttackerFightProps>;
export interface DefenderFightProps {
    combatAbilityModifier: number;
}
export declare const combineDefenderFightProps: PropUtils<DefenderFightProps>;
export interface ConquerCellProps {
    additionalUnits: number;
}
export declare const combineConquerCellProps: PropUtils<ConquerCellProps>;
export interface DefendCellProps {
    additionalUnits: number;
}
export declare const combineDefendCellProps: PropUtils<DefendCellProps>;
export {};
