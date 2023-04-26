import type { Event } from "@/entities/event";
import type { Task } from "@/entities/task";
import type { User } from "@/entities/user";

interface SuccessApiResponse<T> {
  message: string;
  result: ApiResult<T>;
}

type ResultWithPagination<T> = {
  pagination: Record<string,any>
  data: T[]
};
interface FailureApiResponse {
  message: string;
  error?: string;
}

type UserResponse = {
	auth: User
}

type ApiResult<T> = T extends Task ? ResultWithPagination<T>|T[] : T[];

type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;

//TYPE GUARDS
export const isSuccessApiResponse = <T>(res: ApiResponse<T>): res is SuccessApiResponse<T> => res.message === "ok";
export const isFailureApiResponse = <T>(res: ApiResponse<T>): res is FailureApiResponse => res.message != "ok";
export const isResultWithPagination = <T>(res: ApiResult<T> | ResultWithPagination<T>): res is ResultWithPagination<T> => (res as ResultWithPagination<T>).hasOwnProperty("pagination") && Array.isArray((res as ResultWithPagination<T>).data)
  

interface FilterPayload {
	select: string[];
	filter: Record<string, any>;
	options: {
		onlyLimit?: boolean;
		page?: number;
		itemsPerPage?: number;
		sortBy?: string[];
		sortDesc?: boolean[];
		groupBy?: string[];
		groupDesc?: boolean[];
		mustSort?: boolean;
		multiSort?: boolean;
		allCount?: number;
		maxPages?: number;
	};
}


type WSTaskChannelMessage = 
| {type: WSEvents.TASK_CREATE, data: Task} 
| {type: WSEvents.TASK_UPDATE, data: Partial<Task>} 
| {type: WSEvents.TASK_STATUS_UPDATE, data: {id: Task['id'], status: Task['status']}}
| {type: WSEvents.EVENT_CREATE, data: Event} 
| {type: WSEvents.EVENT_UPDATE, data: Partial<Event>}
| {type: WSEvents.EVENT_STATUS_UPDATE, data: {task_id: Task['id'], id: Event['id'], status: Event['status'] }} 


export const enum WSEvents {
	TASK_CREATE = 'task:create',
	TASK_UPDATE = 'task:update',
	TASK_STATUS_UPDATE = 'task:status_update',
	EVENT_CREATE = 'event:create',
	EVENT_UPDATE = 'event:update',
	EVENT_STATUS_UPDATE = 'event:status_update',
}

export type { ApiResponse, SuccessApiResponse, FailureApiResponse, FilterPayload, UserResponse, WSTaskChannelMessage };