export type PropUtils<TProps> = {
  combine: (a: TProps, b: TProps) => TProps;
  default: TProps;
};

export interface AttackerFightProps {
  combatAbilityModifier: number;
}

export const combineAttackerFightProps: PropUtils<AttackerFightProps> = {
  combine: (a, b) => {
    return {
      combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
    };
  },
  default: { combatAbilityModifier: 0 },
};

export interface DefenderFightProps {
  combatAbilityModifier: number;
  membraneAbsorption: number;
}

export const isDefenderFightProps = (
  fightProps: any
): fightProps is DefenderFightProps => {
  return fightProps.membraneAbsorption !== undefined;
};

export const combineDefenderFightProps: PropUtils<DefenderFightProps> = {
  combine: (a, b) => {
    return {
      combatAbilityModifier: a.combatAbilityModifier + b.combatAbilityModifier,
      membraneAbsorption: a.membraneAbsorption + b.membraneAbsorption,
    };
  },
  default: { combatAbilityModifier: 0, membraneAbsorption: 0 },
};

export interface AttackerConquerCellProps {
  additionalUnits: number;
}

export const combineAttackerConquerCellProps: PropUtils<AttackerConquerCellProps> = {
  combine: (a, b) => {
    return {
      additionalUnits: a.additionalUnits + b.additionalUnits,
    };
  },
  default: { additionalUnits: 0 },
};

export interface DefenderConquerCellProps {
  unitsInPercentToRemain: number;
}

export const combineDefenderConquerCellProps: PropUtils<DefenderConquerCellProps> = {
  combine: (a, b) => {
    return {
      unitsInPercentToRemain:
        a.unitsInPercentToRemain * b.unitsInPercentToRemain,
    };
  },
  default: { unitsInPercentToRemain: 1 },
};

export interface DefendCellProps {
  additionalUnits: number;
}

export const combineDefendCellProps: PropUtils<DefendCellProps> = {
  combine: (a, b) => {
    return {
      additionalUnits: a.additionalUnits + b.additionalUnits,
    };
  },
  default: { additionalUnits: 0 },
};
