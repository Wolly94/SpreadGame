export declare type PropUtils<TProps> = {
    combine: (a: TProps, b: TProps) => TProps;
    default: TProps;
};
export interface AttackerFightProps {
    combatAbilityModifier: number;
}
export declare const combineAttackerFightProps: PropUtils<AttackerFightProps>;
export interface DefenderFightProps {
    combatAbilityModifier: number;
    membraneAbsorption: number;
}
export declare const isDefenderFightProps: (fightProps: any) => fightProps is DefenderFightProps;
export declare const combineDefenderFightProps: PropUtils<DefenderFightProps>;
export interface AttackerConquerCellProps {
    additionalUnits: number;
}
export declare const combineAttackerConquerCellProps: PropUtils<AttackerConquerCellProps>;
export interface DefenderConquerCellProps {
    unitsInPercentToRemain: number;
}
export declare const combineDefenderConquerCellProps: PropUtils<DefenderConquerCellProps>;
export interface DefendCellProps {
    additionalUnits: number;
}
export declare const combineDefendCellProps: PropUtils<DefendCellProps>;
