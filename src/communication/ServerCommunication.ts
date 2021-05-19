interface ServerSideClient<TSenderMessage> {
  token: string;
  sendToClient: (message: TSenderMessage) => void;
}

export class ServerCommunication<TSenderMessage, TReceiverMessage> {
  clients: ServerSideClient<TSenderMessage>[];
  onReceiveMessage: (message: TReceiverMessage, token: string) => void;

  constructor(
    onReceiveMessage: (message: TReceiverMessage, token: string) => void
  ) {
    this.clients = [];
    this.onReceiveMessage = onReceiveMessage;
  }

  connectClient(client: ServerSideClient<TSenderMessage>) {
    const exClientIndex = this.clients.findIndex(
      (cl) => cl.token === client.token
    );
    if (exClientIndex >= 0) {
      this.clients[exClientIndex] = client;
    } else {
      this.clients.push(client);
    }
  }

  sendMessageToClients(message: TSenderMessage) {
    this.clients.forEach((cl) => cl.sendToClient(message));
  }

  sendMessageToClient(message: TSenderMessage, token: string) {
    const cl = this.clients.find((cl) => cl.token === token);
    if (cl !== undefined) cl.sendToClient(message);
    else
      console.log(
        "Could not send message to client because client could not be found!"
      );
  }
}
