const ws = require("ws");
const qs = require("qs");

const port = 8080;
const verifyClient = (info, done) => {
  const query = info.req.url.substr(1);
  const user = qs.parse(query, { ignoreQueryPrefix: true });
  if (!user) done();
  if (!user.nickname) done();
  if (!user.color) done();

  info.req.nickname = user.nickname;
  info.req.color = user.color;
  done(true);
};
const wss = new ws.WebSocketServer({ port, verifyClient });

const messages = [];

const handleClientMessage = (client, messageBuffer) => {
  try {
    const messageString = messageBuffer.toString();
    const message = JSON.parse(messageString);
    if (!message.type) throw new Error("invalid message");

    switch (message.type) {
      case "send-message":
        messages.push(messaga.payload.messageText);
        wss.clients.send({ type: "new-message", payload: message.payload });
        break;
      case "send-reaction":
        break;
      case "create-room":
        break;
      case "join-room":
        break;
      case "left-room":
        break;
    }

    client.send(
      JSON.stringify({
        type: "success",
        payload: { executedAction: "send-message" },
      })
    );
  } catch (error) {
    client.send(
      JSON.stringify({
        type: "error",
        payload: { executedAction: "send-message" },
      })
    );
  }
};

const handleClientClose = () => {};

wss.on("listening", () => {
  console.log(`Server run on port: ${port}`);
});

wss.on("connection", (client, req) => {
  client.on("message", (messageBuffer) => {
    const messageString = messageBuffer.toString();
    const message = {
      nickname: req.nickname,
      color: req.color,
      content: messageString,
    };
    wss.clients.forEach((client) => client.send(JSON.stringify(message)));
  });
  client.on("close", handleClientClose);
});
