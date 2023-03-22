import { isResultWithPagination } from "../types/api";
import PipeApi from "@/api/pipe";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";
import PipeRepo from "@/api/pipe";
import type { ITaskRepo, Task } from "@/types/task";
import TaskRepo from "@/api/task";
import { useTaskStore } from "@/stores/task";


const taskStore = useTaskStore();

export default class TaskService {

	taskRepo;

	constructor(taskRepo: ITaskRepo) {
		this.taskRepo = taskRepo;
	}

	getFilterBase(){
		return TaskRepo.filterBase
	}

	fetchTasks (payload?: FilterPayload | Partial<FilterPayload>, signal?: AbortSignal) {
		return this.taskRepo
			.GetTasks(payload, signal)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							taskStore.setSingleTask(respdata.result.queryResult[0]);
						} else {
							const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
							taskStore.setSingleTask(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							taskStore.setTasksList(respdata.result.queryResult);
						} else {
							taskStore.setTasksList(respdata.result);
						}
					}
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	upsertTask(payload: Partial<Task> | Task) {
		return this.taskRepo
			.UpsertTask(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}

	takeTask(id: number) {
		return this.taskRepo
			.TakeTask(id)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}

}