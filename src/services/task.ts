import { ElMessage } from 'element-plus';
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
import type { Event } from '@/types/event';
import type { User } from '@/types/user';



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

	takeTask(task: Task) {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		const msg = ElMessage({
			message: "Хватаю задачу..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.TakeTask(task.id, taskLastEvent.id )
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Задача твоя!",
						type: "success",
						center: true,
						duration: 2000,
						showClose: true,
					});
					return true;
				} else {
					console.log('respdata', respdata)
					errVueHandler(respdata.error!);
					return respdata.message || -1;
				}
			})
			.catch(err => {
				console.log('sssssss')
				console.log('err', err)
				errRequestHandler(err)
			})
			.finally(()=>{
				msg.close();
			})
	}

	updateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']) {
		return this.taskRepo
			.UpdateEventStatus(taskId, eventId, status)
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

	dragAndDropTask(task: Task, newEventStatus: number) {
		const eventToUpdate = task.event_entities![task.event_entities!.length - 1]
		if(eventToUpdate.status === newEventStatus) {
			return;
		} else {
			const msg = ElMessage({
				message: "Сохраняю задачу..",
				type: "success",
				center: true,
				duration: 1000,
			});
			console.log('newEventStatus', newEventStatus)
			this.updateEventStatus(task.id, eventToUpdate.id, newEventStatus)
				.then(res => {
					console.log('res', res)
					if (res) {
					ElMessage({
						message: "Операция выполнена успешно!",
						type: "success",
						center: true,
						duration: 1500,
						showClose: true,
					});
					} else {
					ElMessage({
						message: "Ошибка при выполнении операции!",
						type: "error",
						center: true,
						duration: 1500,
						showClose: true,
					});
					}
				})
				.finally(() => {
					msg.close();
				});
		  }
	}

	canTakeTask(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return ((taskLastEvent.selected_users.length===0 && taskLastEvent.selected_divisions.length===0) || taskLastEvent.selected_users.includes(user.id))
				&& taskLastEvent.status === 1
	}
	canFinishTask(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return taskLastEvent.u_id===user.id && taskLastEvent.status === 2
	}
}