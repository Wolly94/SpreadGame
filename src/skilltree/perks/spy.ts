import {
    AttachProps,
    TimedProps,
} from "../../spreadGame/mechanics/events/definitions";
import {
    StolenPerksProps,
    stolenPerksUtils,
} from "../../spreadGame/mechanics/events/stolenPerk";
import { SkilledPerk } from "../skilltree";
import { BaseDefensePerk } from "./baseDefense";
import { backupFromPerk, BackUpPerk, CreatePerk, getPerkValue } from "./perk";

const name = "Spy";
const defaultValue = 0;
const defaultValues = [100];

const perkToBeStolenInReplay: BackUpPerk = {
    name: BaseDefensePerk.name,
    data: { type: "number", val: [10, 20] },
};

export const SpyPerk: CreatePerk<number> = {
    name: name,
    createFromValues: (values = defaultValues) => {
        return {
            name: name,
            displayName: name,
            defaultValue: defaultValue,
            values: values,
            description: (lvl) =>
                "For every captured enemy cell you gain one of your enemies skills (starting with the cheapest).",
            triggers: [
                {
                    type: "ConquerCell",
                    getValue: (
                        trigger,
                        game
                    ): AttachProps<TimedProps<StolenPerksProps>>[] => {
                        const playerId = trigger.after.cell.playerId;
                        const val = getPerkValue(
                            game,
                            name,
                            playerId,
                            values,
                            defaultValue
                        );
                        if (val === defaultValue) return [];
                        const probabilityToSteal = val / 100;
                        const rand = Math.random();
                        if (rand > probabilityToSteal) return [];

                        const ownPerks = game.getSkilledPerks(playerId);
                        const availablePerks = game
                            .getSkilledPerks(trigger.before.cell.playerId)
                            .filter(
                                (sp) =>
                                    !ownPerks.some(
                                        (ownSp) =>
                                            ownSp.perk.name === sp.perk.name
                                    )
                            );

                        if (availablePerks.length === 0) return [];
                        const stealPerk: SkilledPerk = {
                            ...availablePerks[0],
                            level: 1,
                        };
                        return [
                            {
                                entity: { type: "Player", id: playerId },
                                perkName: name,
                                triggerType:
                                    "StolenPerk" + game.timePassed.toString(),
                                props: {
                                    expirationInMs: "Never",
                                    value: {
                                        ...stolenPerksUtils.default,
                                        skilledPerks: [stealPerk],
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
                    units: 100,
                },
                {
                    id: 1,
                    playerId: 1,
                    position: [400, 100],
                    radius: 50,
                    units: 40,
                },
            ],
            players: 2,
        },
        moveHistory: [
            {
                timestamp: 0,
                data: {
                    type: "sendunitsmove",
                    data: {
                        playerId: 0,
                        senderIds: [0],
                        receiverId: 1,
                    },
                },
            },
        ],
        perks: [
            {
                name: name,
                data: { type: "number", val: defaultValues },
            },
            perkToBeStolenInReplay,
        ],
        players: [
            { id: 0, skills: [{ name: name, level: 1 }] },
            { id: 1, skills: [{ name: BaseDefensePerk.name, level: 1 }] },
        ],
    },
};
