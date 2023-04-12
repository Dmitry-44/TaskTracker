import { emptyTask } from '../entities/task';
import { defineStore } from "pinia";
import type { Task } from "@/entities/task";
import type { Event } from '@/entities/event';

interface State {
	tasks: Task[];
	singleTask: Task | null;
	activeTask: Task;
	taskByEventIdHash: Map<number, Task>
}


export const useTaskStore = defineStore({
	id: "task",
	state: (): State => ({
		activeTask: Object.assign({}, emptyTask),
		tasks: [],
		singleTask: null,
		taskByEventIdHash: new Map()
	}),
	getters: {
		getList: (state): Task[] => state.tasks,
		getSingleTask: (state) => state.singleTask,
		getActiveTask: (state) => state.activeTask,
	},
	actions: {
		setActiveTask(payload: Task): void {
			this.activeTask = payload;
		},
		setTasksList(payload: Task[]): void {
			this.tasks = payload;
		},
		setSingleTask(payload: Task | null): void {
			this.singleTask = payload;
		},
		updateTask(payload: Partial<Task>): void {
			const index = this.tasks.findIndex(task => task.id === payload.id)
			if(!index)return;
			this.tasks[index]=Object.assign(this.tasks[index], payload)
		},
		addNewTask(payload: Task): void {
			this.tasks = [payload, ...this.tasks]
		},
		updateTaskStatus(taskId: Task['id'], status: Task['status']):void {
			let task = this.tasks.find(task=>task.id===taskId)
			console.log('task_to_update___', task?.status)
			if(!task)return;
			task.status=status
			console.log('task_to_update___', task.status)
		},
		pushNewEventToTask(event: Event): void {
			let task = this.tasks.find(task=>task.id===event.task_id)
			if(!task)return;
			task.events?.push(event.id)
			task.event_entities?.push(event)
			this.updateTask(task)
		},
		getTaskByEventId(eventId: Event['id']): Task|null {
			return this.tasks.find(task=>task.events?.includes(eventId)) || null
		},
		eventUpdate(taskId: Task['id'], event: Partial<Event>): void {
			let task;
			task = this.taskByEventIdHash.get(event.id!) as Task
			if(!task){
				task = this.tasks.find(task=>task.id===taskId)
				if(!task)return;
				this.taskByEventIdHash.set(event.id!,task)
			}
			let eventToUpdate = task?.event_entities?.find(ev=>ev.id===event.id)
			if(!eventToUpdate)return;
			eventToUpdate = Object.assign(eventToUpdate,event)
		},
		updateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): void {
			console.log('store update event status')
			let task = this.tasks.find(task=>task.id===taskId)
			if(!task)return;
			let eventToUpdate = task?.event_entities?.find(ev=>ev.id===eventId)
			if(!eventToUpdate)return;
			eventToUpdate.status=status
		},
		getTaskFromHashByEvent(taskId: Task['id'], eventId: Event['id']): Task|undefined {
			let task = this.taskByEventIdHash.get(eventId)
			if(!task){
				task = this.tasks.find(task=>task.id===taskId)
				if(!task)return task;
				this.taskByEventIdHash.set(eventId,task)
				return task
			} else {
				return task
			}
		}
	},
});