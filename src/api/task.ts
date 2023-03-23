import { envConfig } from "@/plugins/envConfig";
import type { FilterPayload } from "@/types";
import type { ApiResponse } from "@/types/api";
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
	}


	GetTasks(filterPayload?: Partial<FilterPayload> | undefined, signal?: AbortSignal | undefined): Promise<ApiResponse<Task>> {
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

	TakeTask(id: number): Promise<ApiResponse<Task>> {
		return axiosClient
        	.post(`${envConfig.API_URL}tasktracker/takeTaskSmi`, { id: id })
			.then(res => res.data)
	}
}
