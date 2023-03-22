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


	GetTasks(filterPayload?: Partial<FilterPayload> | undefined, signal?: AbortSignal | undefined): Promise<ApiResponse<Task>> {
		return axiosClient
			.post(
				`${envConfig.API_URL}tasktracker/tasks`,
				{ ...TaskRepo.filterBase, ...filterPayload },
				{ signal }
			)
			.then((res) => res.data)
	}
	UpsertTask(payload: Partial<Task>): Promise<ApiResponse<Task>> {
		return axiosClient
			.post(`${envConfig.API_URL}tasktracker/taskUpsert`, payload)
	}

	TakeTask(id: number): Promise<ApiResponse<Task>> {
		return axiosClient
        	.post(`${envConfig.API_URL}tasktracker/takeTaskSmi`, { id: id })
	}
}
