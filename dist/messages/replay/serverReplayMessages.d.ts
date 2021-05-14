import SpreadReplay from './replay';
export interface SendReplayMessage {
    type: 'sendreplay';
    data: SpreadReplay;
}
declare type GameServerMessage = SendReplayMessage;
export default GameServerMessage;
