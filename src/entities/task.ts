import { ElMessage } from 'element-plus';
import type { Event } from "@/entities/event";
import type { FilterPayload, ApiResponse } from "@/api";


const TASK_TITLE_MIN_LENGTH = 5
const TASK_TITLE_MAX_LENGTH = 200
const TITLE_IS_REQUARED = true
const DIVISION_IS_REQUARED = true
//пока бэк не умеет сохранять без пайпа
const PIPE_IS_REQUARED = true

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
	division_id: undefined,
	pipe_id: undefined,
	text: "",
	event_entities: [],
	pipe_data: {}
}

export enum TaskStatus {
	CREATED = 1,
	READY_TO_PROGRESS,
	IN_PROGRESS,
	COMPLETED,
}

export enum TaskPriority {
	EXTRA = 1,
	URGENT,
	BASIC,
	LOW,
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

export const validateTask = (task: Partial<Task>): boolean => {
	if(TITLE_IS_REQUARED && task.title!.length===0){
		ElMessage({
			message: "У задачи должен быть заголовок!",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(task.title!.length<TASK_TITLE_MIN_LENGTH){
		ElMessage({
			message: "Минимальная длина заголовка 5 символов",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(task.title!.length>TASK_TITLE_MAX_LENGTH){
		ElMessage({
			message: "Заголовок не должен превышать 200 символов",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	console.log('task', task)
	if(DIVISION_IS_REQUARED && task.division_id === undefined){
		ElMessage({
			message: "У задачи не выбрано подразделение!",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(task.pipe_id!<0){
		ElMessage({
			message: "Ошибка валидации пайплайна",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(PIPE_IS_REQUARED && task.pipe_id === undefined){
		ElMessage({
			message: "У задачи не задан пайплайн!",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(task.priority!<0){
		ElMessage({
			message: "Ошибка валидации приоритета",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	if(task.status!<0){
		ElMessage({
			message: "Ошибка валидации статуса",
			type: "info",
			center: true,
			showClose: true,
		});
		return false
	}
	return true
}

interface ITaskRepo {
	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>>
	CompleteEvent(taskId: Task['id'], eventId: Event['id'], eventResult: Event['result']): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };

// export const getPipeDataFromOperationParams = (params: Operation['params']): Task['pipe_data'] => {
// 	let pipeData: Task['pipe_data'] = {}
// 	if('direction' in params){
// 		pipeData['direction']=0
// 	}
// 	if('time' in params){
// 		pipeData['time']=0
// 	}
// 	if('site_ids' in params){
// 		pipeData['site_ids']=[]
// 	}
// 	if('site_id' in params){
// 		pipeData['site_id']=null
// 	}
// 	return pipeData
// }