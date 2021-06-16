import { SpreadGameImplementation } from "..";
import { SkilledPerk } from "../../skilltree/skilltree";
import Cell from "../cell";
import { Effect } from "./definitions";

export type PropUtils<TProps, TEvent> = {
    combine: (a: TProps, b: TProps) => TProps;
    default: TProps;
    collect: (
        perks: SkilledPerk[],
        trigger: TEvent,
        spreadGame: SpreadGameImplementation
    ) => TProps;
};

export interface AttackerDefendCellProps {
    blockGrowthInMs: number;
}

export interface AttackerDefendCellTrigger {
    attackerPlayerId: number;
    defender: Cell;
}

export interface AttackerDefendCellEffect
    extends Effect<AttackerDefendCellProps, AttackerDefendCellTrigger> {
    type: "AttackerDefendCellEffect";
    getValue: (
        level: number, // level of perk
        trigger: AttackerDefendCellTrigger,
        spreadGame: SpreadGameImplementation
    ) => AttackerDefendCellProps;
}

export const attackerDefendCellUtils: PropUtils<
    AttackerDefendCellProps,
    AttackerDefendCellTrigger
> = {
    combine: (a, b) => {
        return {
            blockGrowthInMs: a.blockGrowthInMs + b.blockGrowthInMs,
        };
    },
    default: { blockGrowthInMs: 0 },
    collect: (skilledPerks, trigger, spreadGame) => {
        const combined = skilledPerks
            .flatMap((skilledPerk) => {
                return skilledPerk.perk.effects
                    .filter(
                        (p): p is AttackerDefendCellEffect =>
                            p.type === "AttackerDefendCellEffect"
                    )
                    .map(
                        (getProps): AttackerDefendCellProps =>
                            getProps.getValue(
                                skilledPerk.level,
                                trigger,
                                spreadGame
                            )
                    );
            })
            .reduce(
                attackerDefendCellUtils.combine,
                attackerDefendCellUtils.default
            );
        return combined;
    },
};
