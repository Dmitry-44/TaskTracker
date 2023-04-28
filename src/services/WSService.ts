import { services } from "@/main";
import type { Socket } from "socket.io-client";

export const listenTaskTrackerChannel = (socket: Socket) => {
	socket.on('taskTrackerSmi', message =>  services.taskStoreUpdater.update(message))
}

