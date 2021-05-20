import ClientMessage from "../messages/clientMessage";
export declare class ClientCommunication<TReceiveMessage, TSenderMessageData> {
    token: string;
    onReceiveMessage: ((message: TReceiveMessage) => void) | null;
    sendMessageToServer: ((message: TSenderMessageData) => void) | null;
    constructor(token: string);
    isReady(): boolean;
    connect(sendMessageToServer: (message: ClientMessage<TSenderMessageData>) => void): void;
    setReceiver(onReceiveMessage: (msg: TReceiveMessage) => void): void;
}
