import ClientMessage from "../messages/clientMessage";

export class ClientCommunication<TReceiveMessage, TSenderMessageData> {
  token: string;
  onReceiveMessage: (message: TReceiveMessage) => void;
  sendMessageToServer: (message: TSenderMessageData) => void;

  constructor(
    token: string,
    onReceiveMessage: (message: TReceiveMessage) => void,
    sendMessageToServer: (message: ClientMessage<TSenderMessageData>) => void
  ) {
    this.token = token;
    this.onReceiveMessage = onReceiveMessage;
    this.sendMessageToServer = (msg: TSenderMessageData) => {
      const mess: ClientMessage<TSenderMessageData> = {
        token: this.token,
        data: msg,
      };
      sendMessageToServer(mess);
    };
  }
}
