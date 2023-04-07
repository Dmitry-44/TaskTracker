import type { ITaskStore } from '@/adapters/types';
import { WSEvents } from '@/types/api'
import type { Event } from '@/types/event';
import type { Task } from '@/types/task';
import type { Socket } from "socket.io-client";



export const listenTaskTrackerChannel = (socket: Socket, store: ITaskStore) => {
	
	const taskStore = store

	socket.on('taskTrackerSmi', function ({ type, data }: {type: string, data: unknown}) {

	console.log('taskTrackerSmi incoming message', type)

	switch (type) {
		case WSEvents.TASK_CREATE: {
			console.log('task create', data)
			taskStore.addNewTask(data as Task)
			break;
		}
		case WSEvents.TASK_UPDATE: {
			console.log('task update', data)
			taskStore.updateTask(data as Task)
			break;
		}
		case WSEvents.TASK_STATUS_UPDATE: {
			console.log('task status update', data)
			if (typeof data === "object" && data !== null) {
				const { id, status } = data as { id: number; status: number };
				if (typeof id === "number" && typeof status === "number") {
					taskStore.updateTaskStatus(id, status)
				}
			}
			break;
		}
		case WSEvents.EVENT_CREATE: {
			taskStore.pushNewEventToTask(data as Event)
			break;
		}
		case WSEvents.EVENT_UPDATE: {
			if (typeof data === "object" && data !== null) {
				const { task_id } = data as { task_id: number };
				if (typeof task_id === "number") {
					taskStore.updateEvent(task_id, data)
				}
			}
			break;
		}
		case WSEvents.EVENT_STATUS_UPDATE: {
			console.log('EVENT_STATUS_UPDATE')
			if (typeof data === "object" && data !== null) {
				const { task_id, id, status } = data as { task_id: number, id: number, status: number };
				if (typeof task_id === "number") {
					taskStore.updateEventStatus(task_id, id, status)
				}
			}
			break;
		}

		//   case 'task:delete': {
		//     taskStore.commit('tasktracker/deleteTask',data)
		//     break;
		//   }
		//   case 'event:delete': {
		//     store.commit('tasktracker/deleteEvent', data)
		//     break;
		//   }
		//   case 'task:upsert': {
		//     if (store.getters['tasktracker/getCurrentPage']===1) {
		//       store.commit('tasktracker/upsertTask', data)
		//     }
		//     break;
		//   }
	}
})
}
