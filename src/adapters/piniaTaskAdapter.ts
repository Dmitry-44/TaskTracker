
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/task';
import type { ITaskStore } from './types';


export default class PiniaTaskAdapter implements ITaskStore {

	taskStore; 

	constructor(){
		this.taskStore = useTaskStore();
	}

	getActiveTask(): Task {
		return this.taskStore.getActiveTask;
	}
	setActiveTask(payload: Task): void{
		return this.taskStore.setActiveTask(payload);
	}
    setTasksList(payload: Task[]): void {
		return this.taskStore.setTasksList(payload);
	}
	setSingleTask(payload: Task | null): void {
		return this.taskStore.setSingleTask(payload);
	}
	updateTask(payload: Task): void {
		return this.taskStore.updateTask(payload);
	}
}