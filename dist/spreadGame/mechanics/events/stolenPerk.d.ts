import { SkilledPerk } from "../../../skilltree/skilltree";
import { PropUtils } from "./definitions";
export interface StolenPerksProps {
    type: "StolenPerk";
    skilledPerks: SkilledPerk[];
}
export declare const stolenPerksUtils: PropUtils<StolenPerksProps>;
