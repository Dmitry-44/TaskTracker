import type { ITaskStore } from '@/adapters';
import { WSEvents, type WSTaskChannelMessage } from '@/api'
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

	socket.on('taskTrackerSmi', function ({ type, data }: WSTaskChannelMessage) {

	console.log('taskTrackerSmi incoming message', type)

	switch (type) {
		case WSEvents.TASK_CREATE: {
			console.log('task create', data)
			taskStore.addNewTask(data)
			updatedTasksWorker(data.id)
			break;
		}
		case WSEvents.TASK_UPDATE: {
			console.log('task update', data)
			taskStore.updateTask(data)
			if(!!data.id){
				updatedTasksWorker(data.id)
			}
			break;
		}
		case WSEvents.TASK_STATUS_UPDATE: {
			console.log('task status update', data)
			taskStore.updateTaskStatus(data.id, data.status)
			updatedTasksWorker(data.id)
			break;
		}
		case WSEvents.EVENT_CREATE: {
			taskStore.pushNewEventToTask(data)
			if(!!data.task_id){
				updatedTasksWorker(data.task_id!)
			}
			break;
		}
		case WSEvents.EVENT_UPDATE: {
			if(!!data.task_id){
				taskStore.updateEvent(data.task_id, data)
				updatedTasksWorker(data.task_id)
			}
			break;
		}
		case WSEvents.EVENT_STATUS_UPDATE: {
			console.log('EVENT_STATUS_UPDATE')
			taskStore.updateEventStatus(data.task_id, data.id, data.status)
			updatedTasksWorker(data.task_id)
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
