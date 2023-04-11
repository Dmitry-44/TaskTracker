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
	division_id: UniqueId;
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
	division_id: 0,
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

interface ITaskRepo {
	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>>
	CompleteEvent(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };