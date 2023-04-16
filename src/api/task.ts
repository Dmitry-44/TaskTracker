import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { FilterPayload, ApiResponse } from "@/api";
import type { Event } from "@/entities/event";
import type { ITaskRepo, Task } from "@/entities/task";
import { axiosClient } from "../plugins/axios";

export default class TaskRepo implements ITaskRepo {

	static filterBase: FilterPayload = 
	{
		select: [
			'id',
			'title',
			'text',
			'pipe_id',
			'priority',
			'status',
			'event_id',
			'division_id',
			'created_by',
			'created_at',
			'pipe_data',
			'events',
			'event_entities',
			'child_tasks',
		],
		filter: {},
		options: {
			onlyLimit: true,
			page: 1,
			itemsPerPage: 1000,
			sortBy: ["id"],
			sortDesc: [false],
			groupBy: [],
			groupDesc: [false],
			mustSort: false,
			multiSort: false,
		},
	}

	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal | undefined): Promise<ApiResponse<Task>> {
		const data = Object.assign(TaskRepo.filterBase, {filter: filterPayload!.filter})
		return axiosClient
			.post(
				`${envConfig.API_URL}tasktracker/tasks`,
				data,
				{ signal }
			)
			.then(res => res.data)
			.catch(err=> {
				return { message: errRequestHandler(err)}
			})
	}
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>> {
		return axiosClient
			.post(`${envConfig.API_URL}tasktracker/taskUpsert`, payload)
			.then(res => res.data)
			.catch(err=> {
				return {message: errRequestHandler(err)}
			})
	}

	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>> {
		return axiosClient
        	.get(`${envConfig.API_URL}tasktracker/task/${taskId}/event/${eventId}/take`)
			.then(res => res.data)
			.catch(err=> {
				return {message: errRequestHandler(err)}
			})
	}

	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>> {
		return axiosClient
        	.post(`${envConfig.API_URL}tasktracker/task/${taskId}/event/${eventId}/status`, { status: status })
			.then(res => res.data)
			.catch(err=> {
				return {message: errRequestHandler(err)}
			})
		
	}

	CompleteEvent(taskId: Task['id'], eventId: Event['id'], eventResult: Event['result']): Promise<ApiResponse<Task>> {
		return axiosClient
        	.post(`${envConfig.API_URL}tasktracker/task/${taskId}/event/${eventId}/complete`, {result: eventResult})
			.then(res => res.data)
			.catch(err=> {
				return {message: errRequestHandler(err)}
			})
		
	}
}
