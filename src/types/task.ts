import type { Event } from "@/types/event";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "./api";

interface Task {
  id: number;
  title: string;
  text: string;
  created_at: number;
  priority?: number;
  status?: number;
  pipe_id?: number;
  event_id?: number;
  division_id?: number;
  created_by?: number;
  events?: number[];
  event_entities?: Event[];
  child_tasks?: Task[];
  smi_direction?: number;
}

interface ITaskRepo {
  	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal): Promise<ApiResponse<Task>>
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>>
	TakeTask(id: number): Promise<ApiResponse<Task>>
}

export type { Task, ITaskRepo };