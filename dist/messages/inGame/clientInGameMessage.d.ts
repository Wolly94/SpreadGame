export interface SendUnits {
    senderIds: number[];
    receiverId: number;
}
export interface SendUnitsMessage {
    type: 'sendunits';
    data: SendUnits;
}
export declare type ClientInGameMessage = SendUnitsMessage;
