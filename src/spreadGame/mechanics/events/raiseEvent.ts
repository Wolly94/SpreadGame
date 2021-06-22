import { Effect, NewSpreadGameEvent, SpreadGameEffect } from "./definitions";
import { StolenPerkEffect, StolenPerkEvent } from "./stolenPerk";

const type = "RaiseEvent";

export type RaisableEvent = StolenPerkEvent; // | InfectCellEvent;

export type RaiseEventProps = {
    type: "RaiseEvent";
    event: RaisableEvent;
};

export type RaiseEventEffect = StolenPerkEffect;

export const isRaisableEvent = (
    event: NewSpreadGameEvent
): event is RaisableEvent => {
    return event.type === "StolenPerk";
};

export const isRaisableEffect = (
    effect: SpreadGameEffect
): effect is RaiseEventEffect => {
    return effect.type === "StolenPerk";
};
