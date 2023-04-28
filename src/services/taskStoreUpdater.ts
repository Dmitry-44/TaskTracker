import type { ITaskStore } from "@/adapters";
import { WSEvents, type WSTaskChannelMessage } from "@/api";

const LIFETIME_UPDATED_TASK=2000

export const updatedTasksIds = new Set<UniqueId>()

const taskStoreUpdater = (store: ITaskStore) => {

	const taskStore = store;

	function update(message: WSTaskChannelMessage){
		const {type, data} = message

		switch (type) {
			case WSEvents.TASK_CREATE: {
				console.log('task create', data)
				taskStore.addNewTask(data)
				setToUpdatedTasksList(data.id)
				break;
			}
			case WSEvents.TASK_UPDATE: {
				console.log('task update', data)
				taskStore.updateTask(data)
				if(!!data.id){
					setToUpdatedTasksList(data.id)
				}
				break;
			}
			case WSEvents.TASK_STATUS_UPDATE: {
				console.log('task status update', data)
				taskStore.updateTaskStatus(data.id, data.status)
				setToUpdatedTasksList(data.id)
				break;
			}
			case WSEvents.EVENT_CREATE: {
				taskStore.pushNewEventToTask(data)
				if(!!data.task_id){
					setToUpdatedTasksList(data.task_id!)
				}
				break;
			}
			case WSEvents.EVENT_UPDATE: {
				if(!!data.task_id){
					taskStore.updateEvent(data.task_id, data)
					setToUpdatedTasksList(data.task_id)
				}
				break;
			}
			case WSEvents.EVENT_STATUS_UPDATE: {
				console.log('EVENT_STATUS_UPDATE')
				taskStore.updateEventStatus(data.task_id, data.id, data.status)
				setToUpdatedTasksList(data.task_id)
				break;
			}
		}
	}

    function setToUpdatedTasksList(id: UniqueId){
        updatedTasksIds.add(id)
        setTimeout(()=>{
            updatedTasksIds.delete(id)
        }, LIFETIME_UPDATED_TASK)
    }

    return {
        update
    }

}

export default taskStoreUpdater
