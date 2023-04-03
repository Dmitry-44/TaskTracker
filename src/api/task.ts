import { envConfig } from "@/plugins/envConfig";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "@/types/api";
import type { Event } from "@/types/event";
import type { ITaskRepo, Task } from "@/types/task";
import { axiosClient } from "../plugins/axios";

export default class TaskRepo implements ITaskRepo {

	static filterBase: FilterPayload = 
	{
		select: [],
		filter: {},
		options: {
			onlyLimit: false,
			page: 1,
			itemsPerPage: 50,
			sortBy: ["id"],
			sortDesc: [false],
			groupBy: [],
			groupDesc: [false],
			mustSort: false,
			multiSort: false,
		},
	}

	static emptyTask: Task = 
	{
		id: -1,
		title: "",
		created_at: -1,
		status: 1,
		text: "",
		event_entities: []
	}


	GetTasks(filterPayload?: Partial<FilterPayload>, signal?: AbortSignal | undefined): Promise<ApiResponse<Task>> {
		return axiosClient
			.post(
				`${envConfig.API_URL}tasktracker/tasks`,
				{ ...TaskRepo.filterBase, ...filterPayload },
				{ signal }
			)
			.then(res => res.data)
	}
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>> {
		return axiosClient
			.post(`${envConfig.API_URL}tasktracker/taskUpsert`, payload)
			.then(res => res.data)
	}

	TakeTask(taskId: Task['id'], eventId: Event['id']): Promise<ApiResponse<Task>> {
		return axiosClient
        	.get(`${envConfig.API_URL}tasktracker/task/${taskId}/event/${eventId}/take`)
			.then(res => res.data)
			.catch(err => {
				console.log('error in api', err)
			})
	}

	UpdateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<ApiResponse<Task>> {
		return axiosClient
        	.post(`${envConfig.API_URL}tasktracker/task/${taskId}/event/${eventId}/status`, { status: status })
			.then(res => res.data)
		
	}
}
