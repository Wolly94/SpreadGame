export default interface ClientCommunication<TReceiveMessage, TSenderMessageData> {
    onReceiveMessage: (message: TReceiveMessage) => void;
    sendMessageToServer: (message: TSenderMessageData) => void;
}
