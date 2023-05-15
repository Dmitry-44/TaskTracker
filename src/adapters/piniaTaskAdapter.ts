
import type { Task, TaskEvent } from '@/entities/task';
import { useTaskStore } from '@/stores/task';
import type { ITaskStore } from '.';
import type { Event } from '@/entities/event';
import type { FilterPayload } from '@/api';


export default class PiniaTaskAdapter implements ITaskStore {

	taskStore; 

	constructor(){
		this.taskStore = useTaskStore();
	}

	getActiveTask(): TaskEvent|null {
		return this.taskStore.getActiveTask;
	}
	setActiveTask(payload: TaskEvent|null): void{
		return this.taskStore.setActiveTask(payload);
	}
    setTasksList(payload: Task[]): void {
		return this.taskStore.setTasksList(payload);
	}
	setSingleTask(payload: Task | null): void {
		return this.taskStore.setSingleTask(payload);
	}
	updateTask(payload: Partial<Task>): void {
		return this.taskStore.updateTask(payload);
	}
	addNewTask(payload: Task): void {
		return this.taskStore.addNewTask(payload)
	}
	updateTaskStatus(payload: Task['id'], status: Task['status']):void {
		return this.taskStore.updateTaskStatus(payload, status)
	}
	pushNewEventToTask(event: Event): void {
		return this.taskStore.pushNewEventToTask(event)
	}
	updateEvent(taskId: number, event: Partial<Event>): void {
		return this.taskStore.eventUpdate(taskId, event)
	}
	updateEventStatus(taskId: number, eventId: number, status: number): void {
		return this.taskStore.updateEventStatus(taskId, eventId, status)
	}
	setTaskToFinish(payload: TaskEvent|null): void {
		return this.taskStore.setTaskToFinish(payload)
	}
	updateFilters(payload: FilterPayload): void {
		return this.taskStore.updateFilters(payload)
	}
	getFilters(): FilterPayload {
		return this.taskStore.getFilters
	}
	setTasksView(payload: TaskEvent[]): void {
		return this.taskStore.setTasksView(payload)
	}
}