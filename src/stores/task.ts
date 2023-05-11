import { emptyTask } from '../entities/task';
import { defineStore } from "pinia";
import type { Task } from "@/entities/task";
import type { EventStatus, Event } from '@/entities/event';
import { lastFromArray } from '@/plugins/utils';
import type { User } from '@/entities/user';
import type { FilterPayload } from '@/api';
import TaskRepo from '@/api/task';

interface State {
	tasks: Task[];
	singleTask: Task | null;
	activeTask: Task;
	taskToFinish: Task|null;
	taskToTake: Task|null;
	filters: FilterPayload
}


export const useTaskStore = defineStore({
	id: "task",
	state: (): State => ({
		activeTask: Object.assign({}, emptyTask),
		tasks: [],
		singleTask: null,
		taskToFinish: null,
		taskToTake: null,
		filters: new TaskRepo().getDefaultFilters
	}),
	getters: {
		getList: (state) => state.tasks,
		getTasksByEventStatus: (state) => {
			return (user: User, status: EventStatus) =>
			state.tasks.filter(task=> {
				const lastEvent = lastFromArray(task.event_entities!)
				if(!lastEvent)return false;
				return lastEvent.status===status 
					&& (
						lastEvent.selected_divisions?.includes(user.selected_group) 
						|| lastEvent.selected_users?.includes(user.id)
						|| (lastEvent.selected_divisions?.length == 0 && lastEvent.selected_users?.length == 0)
					)
			})
		},
		getMyTasksByEventStatus: (state) => {
			return (user: User, status: EventStatus) => 
				state.tasks.filter(task => {
					if(task.created_by!=user.id)return false;
					const lastEvent = lastFromArray(task.event_entities!)
					if(!lastEvent)return false;
					return lastEvent.status===status
				})
		},
		getSingleTask: (state) => state.singleTask,
		getActiveTask: (state) => state.activeTask,
		getTaskToFinish: (state) => state.taskToFinish,
		getTaskToTake: (state) => state.taskToTake,
		getFilters: (state) => state.filters
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
		setTaskToFinish(payload: Task|null): void {
			this.taskToFinish = payload
		},
		setTaskToTake(payload: Task|null): void {
			this.taskToTake = payload
		},
		updateActiveTask(task: Partial<Task>): void {
			this.activeTask = Object.assign(this.activeTask, task)
		},
		updateTask(payload: Partial<Task>): void {
			let task = this.tasks.find(task=>task.id===payload.id)
			if(!task)return;
			task=Object.assign(task, payload)
		},
		addNewTask(payload: Task): void {
			this.tasks = [payload, ...this.tasks]
		},
		updateTaskStatus(taskId: Task['id'], status: Task['status']):void {
			let task = this.tasks.find(task=>task.id===taskId)
			if(!task)return;
			task.status=status
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
			let task = this.tasks.find(task=>task.id===taskId)
			if(!task)return;
			let eventToUpdate = task?.event_entities?.find(ev=>ev.id===event.id)
			if(!eventToUpdate)return;
			eventToUpdate = Object.assign(eventToUpdate,event)
		},
		updateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): void {
			let task = this.tasks.find(task=>task.id===taskId)
			if(!task)return;
			let eventToUpdate = task?.event_entities?.find(ev=>ev.id===eventId)
			if(!eventToUpdate)return;
			eventToUpdate.status=status
		},
		updateFilters(filters: FilterPayload): void {
			this.filters.select = filters.select.length>0 ? filters.select : this.filters.select
			this.filters.filter = Object.assign(this.filters.filter, filters.filter)
			this.filters.options = Object.assign(this.filters.options, filters.options)
		}
	},
});