import { NewSpreadGameEvent, SpreadGameEffect } from "./definitions";
import { InfectEffect, InfectEvent } from "./infect";
import { StolenPerkEffect, StolenPerkEvent } from "./stolenPerk";
export declare type RaisableEvent = StolenPerkEvent | InfectEvent;
export declare type RaiseEventProps = {
    type: "RaiseEvent";
    event: RaisableEvent;
};
export declare type RaiseEventEffect = StolenPerkEffect | InfectEffect;
export declare const isRaisableEvent: (event: NewSpreadGameEvent) => event is RaisableEvent;
export declare const isRaisableEffect: (effect: SpreadGameEffect) => effect is RaiseEventEffect;
