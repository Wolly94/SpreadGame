import { AttackerConquerCellEffect } from "../spreadGame/gameProps/attackerConquerCell";
import { AttackerFightEffect } from "../spreadGame/gameProps/attackerFight";
import { DefenderConquerCellEffect } from "../spreadGame/gameProps/defenderConquerCell";
import { DefenderDefendCellEffect } from "../spreadGame/gameProps/defenderDefendCell";
import { DefenderFightEffect } from "../spreadGame/gameProps/defenderFight";

export type PerkEffect =
  | AttackerFightEffect
  | DefenderFightEffect
  | AttackerConquerCellEffect
  | DefenderConquerCellEffect
  | DefenderDefendCellEffect;
