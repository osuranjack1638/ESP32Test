import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 3000 });

let phones = [];

wss.on("connection", (ws) => {

  ws.on("message", (msg) => {
    const data = msg.toString();

    // register phone
    if (data === "PHONE") {
      phones.push(ws);
      ws.send("PHONE_REGISTERED");
      return;
    }

    // forward ESP32 messages to phones
    phones.forEach(p => {
      if (p.readyState === WebSocket.OPEN) {
        p.send("ESP32: " + data);
      }
    });
  });

});

console.log("Cloud WebSocket running");