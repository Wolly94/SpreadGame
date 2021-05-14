import SpreadReplay from "./replay";
export interface SendReplayMessage {
    type: "sendreplay";
    data: SpreadReplay;
}
export declare type ServerReplayMessage = SendReplayMessage;
