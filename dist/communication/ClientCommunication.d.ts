import ClientMessage from "../messages/clientMessage";
export declare class ClientCommunication<TReceiveMessage, TSenderMessageData> {
    token: string;
    onReceiveMessage: (message: TReceiveMessage) => void;
    sendMessageToServer: (message: TSenderMessageData) => void;
    constructor(token: string, onReceiveMessage: (message: TReceiveMessage) => void, sendMessageToServer: (message: ClientMessage<TSenderMessageData>) => void);
}
