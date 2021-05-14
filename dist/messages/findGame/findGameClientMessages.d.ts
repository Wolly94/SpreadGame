export interface JoinGameMessageData {
    type: 'joingame';
    data: {
        gameId: number;
    };
}
declare type FindGameClientMessageData = JoinGameMessageData;
export default FindGameClientMessageData;
