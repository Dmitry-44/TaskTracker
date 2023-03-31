import { useInterfaceStore } from './../stores/interface';
import { isResultWithPagination } from "../types/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import type { FilterPayload } from "@/types/api";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { ITaskRepo, Task } from "@/types/task";
import TaskRepo from "@/api/task";
import router from '@/router';
import type PiniaTaskAdapter from '@/adapters/piniaTaskAdapter';
import type PiniaInterfaceAdapter from '@/adapters/piniaInterfaceAdapter';



export default class TaskService {

	taskRepo;
	interfaceStore;
	taskStore;

	constructor(taskRepo: ITaskRepo, taskStore: PiniaTaskAdapter, interfaceStore: PiniaInterfaceAdapter) {
		this.taskRepo = taskRepo;
		this.taskStore = taskStore;
		this.interfaceStore=interfaceStore;
	}

	fetchTasks (payload?: FilterPayload | Partial<FilterPayload>, signal?: AbortSignal) {
		return this.taskRepo
			.GetTasks(payload, signal)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							this.taskStore.setSingleTask(respdata.result.queryResult[0]);
						} else {
							const payload =
							respdata.result.length > 0
								? respdata.result[0]
								: null;
							this.taskStore.setSingleTask(payload);
						}
					} else {
						const tasks = 
							isResultWithPagination(respdata.result)
							? respdata.result.queryResult
							: respdata.result

						this.taskStore.setTasksList(tasks);
					}
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	upsertTask(payload: Partial<Task>) {
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

	setActiveTask(payload: Task|null){
		const activeTask = this.taskStore.getActiveTask()
		if (
			activeTask?.id == payload?.id &&
			!this.interfaceStore.getIsCreatingTaskProcess()
		)
			return;
		payload  
			? this.taskStore.setActiveTask(payload)
			: this.taskStore.setActiveTask(Object.assign({},TaskRepo.emptyTask));
	}

	clickTask(task: Task) {
		this.taskStore.setActiveTask(task)
		this.interfaceStore.toggleCreatingTaskProcess(false)
		this.interfaceStore.toggleDetailsWindow(true)
	}

	clickOutsideTaskCard(){
		this.interfaceStore.toggleDetailsWindow(false)
		this.interfaceStore.toggleCreatingTaskProcess(false)
		this.taskStore.setActiveTask(TaskRepo.emptyTask)
	}

	createNewTask(){
		this.interfaceStore.toggleCreatingTaskProcess(true)
		this.taskStore.setActiveTask(TaskRepo.emptyTask)
		this.interfaceStore.toggleDetailsWindow(true)
	}

	closeDetailWindow(){
		this.interfaceStore.toggleDetailsWindow(false),
		this.setActiveTask(TaskRepo.emptyTask),
		this.interfaceStore.toggleCreatingTaskProcess(false)
	}

	openTaskInNewTab(task: Task){
		const routeData = router.resolve({ path: `/tasks/${task.id}` });
  		window.open(routeData.href, "_blank");
	}

	searchTasks(tasksList: Task[], search: string) {
		let tasks = JSON.parse(JSON.stringify(tasksList)) as Task[];
		return tasks.filter(
			(task) =>
			task.title
				.concat(" ", task.text)
				.toLowerCase()
				.indexOf(search.toLowerCase()) !== -1
		);
	}
}