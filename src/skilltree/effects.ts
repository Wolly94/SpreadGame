import { FightProps } from "../spreadGame/spreadGame";

export interface GetFightProps {
  type: "FightEffect";
  getValue: (level: number) => FightProps; //eventHistory: HistoryEntry<SpreadGameEvent>[]) => number;
}

export type PerkEffect = GetFightProps;
