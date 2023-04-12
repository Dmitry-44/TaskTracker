import type { Event } from "@/types/event";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "./api";

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
	{ id: TaskPriority.EXTRA, value: "Молния", color: "#E6A23C" },
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

interface ITaskRepo {
	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>>
	CompleteEvent(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };