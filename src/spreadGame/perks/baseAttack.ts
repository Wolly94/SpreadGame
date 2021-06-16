import { formatDescription } from "../../skilltree/utils";
import { AttachProps, TimedProps } from "../mechanics/events/definitions";
import { BubbleFightProps } from "../mechanics/events/fight";
import { CreatePerk, getPerkValue } from "./perk";

const name = "BaseAttack";
const defaultValue = 0;
const baseAttackDefaultValues = [10, 20, 30];
export const BaseAttackPerk: CreatePerk<number> = (
    values = baseAttackDefaultValues
) => {
    return {
        name: name,
        displayName: "Base Attack",
        values: values,
        defaultValue: defaultValue,
        description: (lvl) =>
            "Raises combat abilities of your bubbles by " +
            formatDescription(values, (val) => val.toString() + "%", "/") +
            ".",
        triggers: [
            {
                type: "CreateBubble",
                getValue: (
                    trigger,
                    game
                ): AttachProps<TimedProps<BubbleFightProps>> => {
                    const val = getPerkValue(
                        game,
                        name,
                        trigger.sendUnitsEvent.sender.playerId,
                        values,
                        defaultValue
                    );
                    return {
                        entity: { type: "Bubble", id: trigger.after.bubble.id },
                        perkName: name,
                        props: {
                            expirationInMs: "Never",
                            value: {
                                type: "BubbleFightProps",
                                combatAbilityModifier: val,
                            },
                        },
                    };
                },
            },
        ],
        replay: {
            gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
            lengthInMs: 5000,
            map: { width: 500, height: 500, players: 2, cells: [] },
            moveHistory: [],
            players: [],
        },
    };
};
