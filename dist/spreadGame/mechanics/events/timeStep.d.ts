import { Effect } from "./definitions";
export interface TimeStepEvent {
    type: "TimeStep";
    ms: number;
}
export interface TimeStepEffect extends Effect<TimeStepEvent> {
    type: TimeStepEvent["type"];
}
