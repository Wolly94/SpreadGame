interface ServerSideClient<TSenderMessage> {
    token: string;
    sendToClient: (message: TSenderMessage) => void;
}
export declare class ServerCommunication<TSenderMessage, TReceiverMessage> {
    clients: ServerSideClient<TSenderMessage>[];
    onReceiveMessage: (message: TReceiverMessage, token: string) => void;
    constructor(onReceiveMessage: (message: TReceiverMessage, token: string) => void);
    connectClient(client: ServerSideClient<TSenderMessage>): void;
    disconnectClient(token: string): void;
    sendMessageToClients(message: TSenderMessage): void;
    sendMessageToClient(message: TSenderMessage, token: string): void;
}
export {};
