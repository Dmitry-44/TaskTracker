import type { Operation } from '@/entities/operation';
import type { Event } from "@/entities/event";
import type { FilterPayload, ApiResponse } from "@/api";


interface Task {
	id: UniqueId;
	title: string;
	text: string;
	pipe_id?: UniqueId;
	priority?: TaskPriority;
	status?: TaskStatus;
	event_id?: UniqueId;
	division_id?: UniqueId;
	created_by?: UniqueId;
	created_at?: DateTimeStamp;
	pipe_data: Record<string, any>
	events?: UniqueId[];
	event_entities?: Event[];
	child_tasks?: Task[];
	smi_direction?: number;
}

export const emptyTask: Readonly<Task> = {
	id: -1,
	title: "",
	// division_id: -1,
	text: "",
	event_entities: [],
	pipe_data: {}
}

export enum TaskStatus {
	CREATED = 1,
	READY_TO_PROGRESS = 2,
	IN_PROGRESS = 3,
	COMPLETED = 4,
}

export enum TaskPriority {
	EXTRA = 1,
	URGENT = 2,
	BASIC = 3,
	LOW = 4,
}

export const taskPriorityOptions: Readonly<Record<string, any>[]> = [
	{ id: TaskPriority.EXTRA, value: "Молния", color: "#FCEC52" },
	{ id: TaskPriority.URGENT, value: "Срочная", color: "#F56C6C" },
	{ id: TaskPriority.BASIC, value: "Базовая", color: "#409EFF" },
	{ id: TaskPriority.LOW, value: "Низкая", color: "#909399" },
]

export const taskStatusOptions: Readonly<Record<string, any>[]> = [
	{ id: TaskStatus.CREATED, value: "Создана", color: "#b3e19d" },
	{ id: TaskStatus.READY_TO_PROGRESS, value: "Обработана", color: "#4ecbc4" },
	{ id: TaskStatus.IN_PROGRESS, value: "В работе", color: "#f8df72" },
	{ id: TaskStatus.COMPLETED, value: "Закончена", color: "#909399" },
]

export const taskDateFormat = (date: DateTimeStamp) => new Date(date * 1000).toLocaleString()

const DAY: DateTimeStamp = 24 * 3600

export const taskTimeOptions = [
	{ value: 15*60*100, time: '15 мин'},
	{ value: 30*60*100, time: '30 мин'},
	{ value: 1*60*60*100, time: '1 час'},
	{ value: 2*60*60*100, time: '2 часа'},
	{ value: 3*60*60*100, time: '3 часа'},
	{ value: 4*60*60*100, time: '4 часа'},
	{ value: 5*60*60*100, time: '5 часов'},
	{ value: 6*60*60*100, time: '6 часов'},
	{ value: 7*60*60*100, time: '7 часов'},
	{ value: 8*60*60*100, time: '8 часов'},
	{ value: 1*24*60*60*100, time: '1 сутки'},
	{ value: 2*24*60*60*100, time: '2 суток'},
	{ value: 1*7*24*60*60*100, time: '1 неделя'},
]
export const getPipeDataFromOperationParams = (params: Operation['params']): Task['pipe_data'] => {
	let pipeData: Task['pipe_data'] = {}
	if('direction' in params){
		pipeData['direction']=0
	}
	if('time' in params){
		pipeData['time']=0
	}
	if('site_ids' in params){
		pipeData['site_ids']=[]
	}
	if('site_id' in params){
		pipeData['site_id']=null
	}
	return pipeData
}

interface ITaskRepo {
	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>>
	CompleteEvent(taskId: Task['id'], eventId: Event['id'], eventResult: Event['result']): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };