import { FightModifier } from "../spreadGame";
import { SpreadGameMechanics } from "./commonMechanics";
export declare const fightBubblePartial: (att: number, def: number, fightModifier: FightModifier, dist: number) => [number | null, number | null];
export declare const cellFighters: (bubbleUnits: number, bubbleSpace: number) => number;
declare const scrapeOffMechanics: SpreadGameMechanics;
export default scrapeOffMechanics;
