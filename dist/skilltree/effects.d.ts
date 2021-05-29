import { FightProps } from "../spreadGame/spreadGame";
export interface GetFightProps {
    type: "FightEffect";
    getValue: (level: number) => FightProps;
}
export declare type PerkEffect = GetFightProps;
