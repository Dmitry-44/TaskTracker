import { Api } from '@/api/api';
import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { FilterPayload, ApiResponse } from "@/api";
import type { Event } from "@/entities/event";
import type { ITaskRepo, Task } from "@/entities/task";
import { axiosClient } from "../plugins/axios";

export default class TaskRepo extends Api implements ITaskRepo {

	// @ts-ignore
	select = [
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
	]
	// @ts-ignore
	filter = {}
	// @ts-ignore
	options = {
		onlyLimit: true,
		page: 1,
		itemsPerPage: 1000,
		sortBy: ["id"],
		sortDesc: [false],
		groupBy: [],
		groupDesc: [false],
		mustSort: false,
		multiSort: false,
	}

	get getDefaultFilters(): FilterPayload {
		return { select: this.select, filter: this.filter, options: this.options }
	}

	GetTasks(filterPayload?: FilterPayload, signal?: AbortSignal): Promise<ApiResponse<Task>> {
		const data = this.mergeFilters(filterPayload)
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
