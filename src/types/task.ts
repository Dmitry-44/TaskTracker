import type { Event } from "@/types/event";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "./api";

interface Task {
	id: number;
	title: string;
	text: string;
	pipe_id?: number;
	priority?: number;
	status?: number;
	event_id?: number;
	division_id: number;
	created_by?: number;
	pipe_data: Record<string, any>
	events?: number[];
	event_entities?: Event[];
	child_tasks?: Task[];
	smi_direction?: number;
}

interface ITaskRepo {
	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>>
	CompleteEvent(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };