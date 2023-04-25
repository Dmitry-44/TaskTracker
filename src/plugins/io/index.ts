import SocketIO from "socket.io-client";
import infoChannelHandler from "@/plugins/io/infoChannel";
import { envConfig } from "@/plugins/envConfig";

const socket = SocketIO(envConfig.WS_URL, {
  transports: ["websocket"],
  reconnection: true,
});
let connected = false;
socket.on("connect_error", function () {
  console.info("WS Connection Failed");
  connected = false;
});
socket.on("connect", function () {
  connected = true;
  console.info("WS Connected to " + envConfig.WS_URL);
});
socket.on("disconnect", function () {
  console.info("WS Disconnected");
  connected = false;
});

infoChannelHandler(socket);

export default socket;
export { connected as WebSocketIsConnected }
