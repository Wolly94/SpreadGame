import { formatDescription } from "../../skilltree/utils";
import { AttachProps, TimedProps } from "../mechanics/events/definitions";
import { BubbleFightProps } from "../mechanics/events/fight";
import { CreatePerk, getPerkValue } from "./perk";

const name = "Rage";
const defaultValue: [number, number] = [0, 0];
export const rageDefaultValues: [number, number][] = [
    [2000, 20],
    [3000, 30],
];
export const RagePerk: CreatePerk<[number, number]> = (
    values = rageDefaultValues
) => {
    return {
        name: name,
        displayName: "Rage",
        values: values,
        defaultValue: defaultValue,
        description: (lvl) =>
            "Whenever a friendly cell is lost, combat abilities of all currently existing bubbles are increased by " +
            formatDescription(values, (val) => val[1].toString() + "%", "/") +
            " for " +
            formatDescription(
                values,
                (val) => (val[0] / 1000).toString(),
                "/"
            ) +
            " seconds.",
        triggers: [
            {
                type: "ConquerCell",
                getValue: (
                    trigger,
                    game
                ): AttachProps<TimedProps<BubbleFightProps>> => {
                    const val = getPerkValue(
                        game,
                        name,
                        trigger.before.cell.playerId,
                        values,
                        defaultValue
                    );
                    return {
                        entity: { type: "Bubble", id: "All" },
                        perkName: name,
                        props: {
                            expirationInMs: val[0] + game.timePassed,
                            value: {
                                type: "BubbleFightProps",
                                combatAbilityModifier: val[1],
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
