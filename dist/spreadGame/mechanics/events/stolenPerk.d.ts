import { SkilledPerk } from "../../../skilltree/skilltree";
import { Effect, PropUtils } from "./definitions";
export interface StolenPerksProps {
    type: "StolenPerk";
    skilledPerks: SkilledPerk[];
}
export interface StolenPerkEvent {
    type: StolenPerksProps["type"];
    stolenPerk: SkilledPerk;
}
export interface StolenPerkEffect extends Effect<StolenPerkEvent> {
    type: StolenPerksProps["type"];
}
export declare const stolenPerksUtils: PropUtils<StolenPerksProps>;
