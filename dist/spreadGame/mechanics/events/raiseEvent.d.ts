import { NewSpreadGameEvent, SpreadGameEffect } from "./definitions";
import { StolenPerkEffect, StolenPerkEvent } from "./stolenPerk";
export declare type RaisableEvent = StolenPerkEvent;
export declare type RaiseEventProps = {
    type: "RaiseEvent";
    event: RaisableEvent;
};
export declare type RaiseEventEffect = StolenPerkEffect;
export declare const isRaisableEvent: (event: NewSpreadGameEvent) => event is StolenPerkEvent;
export declare const isRaisableEffect: (effect: SpreadGameEffect) => effect is StolenPerkEffect;
