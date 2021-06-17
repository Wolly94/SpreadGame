import { ConquerCellProps } from "../../spreadGame/mechanics/events/conquerCell";
import {
    AttachProps,
    TimedProps,
} from "../../spreadGame/mechanics/events/definitions";
import { formatDescription } from "../utils";
import { CreatePerk, getPerkValue, Perk } from "./perk";

const name = "Slavery";
const defaultValue = 0;
const defaultValues = [10, 20];

export const SlaveryPerk: CreatePerk<number> = {
    name: name,
    createFromValues: (values = defaultValues) => {
        return {
            name: name,
            displayName: name,
            values: values,
            defaultValue: defaultValue,
            description: (lvl) =>
                "Every newly conquered cell gains +" +
                formatDescription(values, (val) => val.toString(), "/") +
                " population.",
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: (
                        trigger,
                        game
                    ): AttachProps<TimedProps<ConquerCellProps>>[] => {
                        const val = getPerkValue(
                            game,
                            name,
                            trigger.after.cell.playerId,
                            values,
                            defaultValue
                        );
                        return [
                            {
                                entity: null,
                                perkName: name,
                                triggerType: "ConquerCell",
                                props: {
                                    expirationInMs: "Never",
                                    value: {
                                        type: "ConquerCell",
                                        additionalUnits: val,
                                    },
                                },
                            },
                        ];
                    },
                },
            ],
        };
    },
    replay: {
        gameSettings: { mechanics: "basic", updateFrequencyInMs: 25 },
        lengthInMs: 5000,
        map: {
            width: 500,
            height: 500,
            cells: [
                {
                    id: 0,
                    playerId: 0,
                    position: [100, 100],
                    radius: 50,
                    units: 120,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: 50,
                    units: 50,
                },
            ],
            players: 2,
        },
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 3 }] },
            { id: 1, skills: [] },
        ],
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: { playerId: 0, senderIds: [0], receiverId: 1 },
                },
            },
        ],
    },
};
