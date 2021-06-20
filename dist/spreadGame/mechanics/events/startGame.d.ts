import { Effect, PropUtils } from "./definitions";
export interface StartGameEvent {
    type: "StartGame";
}
export interface StartGameCellProps {
    type: StartGameEvent["type"];
    additionalUnits: number;
}
export interface StartGameEffect extends Effect<StartGameEvent> {
    type: StartGameEvent["type"];
}
export declare const startGameCellUtils: PropUtils<StartGameCellProps>;
