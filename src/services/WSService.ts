import type { ITaskStore } from '@/adapters';
import { WSEvents } from '@/api'
import type { Event } from '@/entities/event';
import type { Task } from '@/entities/task';
import type { Socket } from "socket.io-client";


const LIFETIME_UPDATED_TASK=2000

export const updatedTasksIds = new Set()


const updatedTasksWorker=(id: Task['id'])=>{
	updatedTasksIds.add(id)
	setTimeout(()=>{
		updatedTasksIds.delete(id)
	}, LIFETIME_UPDATED_TASK)
}

export const listenTaskTrackerChannel = (socket: Socket, store: ITaskStore) => {

	const taskStore = store

	socket.on('taskTrackerSmi', function ({ type, data }: {type: string, data: any}) {

	console.log('taskTrackerSmi incoming message', type)

	switch (type) {
		case WSEvents.TASK_CREATE: {
			console.log('task create', data)
			taskStore.addNewTask(data as Task)
			updatedTasksWorker(data.id)
			break;
		}
		case WSEvents.TASK_UPDATE: {
			console.log('task update', data)
			taskStore.updateTask(data as Task)
			updatedTasksWorker(data.id)
			break;
		}
		case WSEvents.TASK_STATUS_UPDATE: {
			console.log('task status update', data)
			if (typeof data === "object" && data !== null) {
				const { id, status } = data as { id: number; status: number };
				if (typeof id === "number" && typeof status === "number") {
					taskStore.updateTaskStatus(id, status)
					updatedTasksWorker(id)
				}
			}
			break;
		}
		case WSEvents.EVENT_CREATE: {
			taskStore.pushNewEventToTask(data as Event)
			updatedTasksWorker(data.task_id)
			break;
		}
		case WSEvents.EVENT_UPDATE: {
			if (typeof data === "object" && data !== null) {
				const { task_id } = data as { task_id: number };
				if (typeof task_id === "number") {
					taskStore.updateEvent(task_id, data)
					updatedTasksWorker(task_id)
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
					updatedTasksWorker(task_id)
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
