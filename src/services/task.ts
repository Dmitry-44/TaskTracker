import { ElMessage } from 'element-plus';
import { useInterfaceStore } from './../stores/interface';
import { isFailureApiResponse, isResultWithPagination } from "../types/api";
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
import { lastEventId } from '@sentry/vue';
import { AxiosError } from 'axios';



export default class TaskService {

	taskRepo;
	interfaceStore;
	taskStore;

	#EVENT_BACKLOG_STATUS=1
	#EVENT_INPROGRESS_STATUS=2
	#EVENT_FINISHED_STATUS=3

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
		const msg = ElMessage({
			message: "Сохраняю задачу..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.UpsertTask(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Задача сохранена!",
						type: "success",
						center: true,
						duration: 2000,
						showClose: true,
					});
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => {
				ElMessage({
					message: "Что-то пошло не так...",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
				return false
			})
			.finally(()=>{
				msg.close()
			})
	}

	async takeTask(task: Task, user: User) {
		if(!this.canTakeTask(task, user)){
			ElMessage({
				message: "Ты не можешь взять эту задачу",
				type: "info",
				center: true,
				duration: 2000,
				showClose: true,
			})
			return false
		}
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		const msg = ElMessage({
			message: "Хватаю задачу..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.TakeTask(task.id, taskLastEvent.id )
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Задача твоя!",
						type: "success",
						center: true,
						duration: 2000,
						showClose: true,
					});
					// taskLastEvent.status=this.#EVENT_BACKLOG_STATUS
					// taskLastEvent.u_id=user.id
					// this.taskStore.updateTask(task)
					// this.taskStore.setActiveTask(task)
					return true;
				} else {
					return errVueHandler(respdata.error!);
				}
			})
			.catch(err => {
				ElMessage({
					message: "Что-то пошло не так...",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
				return false
			})
			.finally(()=>{
				msg.close();
			})
	}

	updateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): Promise<boolean> {
		const msg = ElMessage({
			message: "Обновляю статус задачи..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.UpdateEventStatus(taskId, eventId, status)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Статус задачи успешно обновлен!",
						type: "success",
						center: true,
						duration: 1500,
						showClose: true,
					});
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => {
				ElMessage({
					message: "Что-то пошло не так...",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
				return false
			})
			.finally(()=>{
				msg.close()
			})
	}

	completeEvent(taskId: Task['id'], eventId: Event['id']): Promise<boolean> {
		const msg = ElMessage({
			message: "Обновляю статус задачи..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.CompleteEvent(taskId, eventId)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					ElMessage({
						message: "Статус задачи успешно обновлен!",
						type: "success",
						center: true,
						duration: 1500,
						showClose: true,
					});
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => {
				ElMessage({
					message: "Что-то пошло не так...",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
				return false
			})
			.finally(()=>{
				msg.close()
			})
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
		this.taskStore.setActiveTask(Object.assign({},TaskRepo.emptyTask))
	}

	createNewTask(){
		this.interfaceStore.toggleCreatingTaskProcess(true)
		this.taskStore.setActiveTask(Object.assign({},TaskRepo.emptyTask))
		this.interfaceStore.toggleDetailsWindow(true)
	}

	closeDetailWindow(){
		this.interfaceStore.toggleDetailsWindow(false),
		this.setActiveTask(Object.assign({},TaskRepo.emptyTask)),
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

	async dragAndDropTask(task: Task, newEventStatus: number, user: User): Promise<boolean> {
		if(newEventStatus<1 || newEventStatus>3){
			return false
		}
		const eventToUpdate = task.event_entities![task.event_entities!.length - 1]
		if(eventToUpdate.status === newEventStatus) {
			return false;
		}
		if(eventToUpdate.status===3){
			return false;
		}
		switch (newEventStatus) {
			case 1:
				return this.returnTaskToBacklog(task, user)
				break;
			case 2:
				//если задача еще не взята, берем задачу на себя и уже после берем в работу
				if(eventToUpdate.u_id!=user.id){
					const didITakeTask = await this.takeTask(task, user)
					if(didITakeTask){
						return this.takeTaskToProgress(task, user)
					} else {
						return false
					}
				//иначе просто берем в работу
				} else {
					return this.takeTaskToProgress(task, user)
				}
				break;
			case 3:
				return this.finishTask(task, user)
				break;
			default:
				return false
		}
	}

	async returnTaskToBacklog(task: Task, user: User): Promise<boolean> {
		if(!this.canReturnTaskToBacklog(task, user)){
			ElMessage({
				message: "Вы не можете вернуть данную задачу к исполнению",
				type: "info",
				center: true,
				duration: 1500,
				showClose: true,
			})
			return false
		} else {
			const eventToUpdate = task.event_entities![task.event_entities!.length - 1]
			return this.updateEventStatus(task.id, eventToUpdate.id, this.#EVENT_BACKLOG_STATUS)
		}
	}
	async takeTaskToProgress(task: Task, user: User): Promise<boolean> {
		if(!this.canTakeTaskToProgress(task, user)){
			ElMessage({
				message: "Вы не можете взять данную задачу в работу",
				type: "info",
				center: true,
				duration: 1500,
				showClose: true,
			})
			return false
		} else {
			const eventToUpdate = task.event_entities![task.event_entities!.length - 1]
			return this.updateEventStatus(task.id, eventToUpdate.id, this.#EVENT_INPROGRESS_STATUS)
		}
	}
	async finishTask(task: Task, user: User) {
		if(!this.canFinishTask(task, user)){
			ElMessage({
				message: "Вы не можете завершить данную задачу",
				type: "info",
				center: true,
				duration: 1500,
				showClose: true,
			})
			return false
		} else {
			const eventToUpdate = task.event_entities![task.event_entities!.length - 1]
			return this.completeEvent(task.id, eventToUpdate.id)
		}
	}

	canTakeTask(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return ((taskLastEvent.selected_users.length===0 && taskLastEvent.selected_divisions.length===0) || taskLastEvent.selected_users.includes(user.id))
				&& !taskLastEvent.u_id
				&& taskLastEvent.status === 1
	}
	canTakeTaskToProgress(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return taskLastEvent.u_id===user.id
			&& taskLastEvent.status === 1
	}
	canReturnTaskToBacklog(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return ((taskLastEvent.selected_users.length===0 && taskLastEvent.selected_divisions.length===0) || taskLastEvent.selected_users.includes(user.id))
				&& taskLastEvent.u_id === user.id
				&& taskLastEvent.status === 2
	}
	canFinishTask(task: Task, user: User): boolean {
		const taskLastEvent = task.event_entities![task.event_entities!.length - 1]
		if(!taskLastEvent){return false};
		return taskLastEvent.u_id===user.id && taskLastEvent.status === 2
	}
	canChangeTaskPriority(task: Task, user: User): boolean {
		if(!(task.id>0))return true;
		return task.created_by === user?.id
				&& (task.status != 4 || !task.status)
	}
	canChangeTaskPipeline(task: Task, user: User): boolean {
		return !(task.id>0)
	}
	canSetTaskPipeline(task: Task, user: User): boolean {
		// if(!task.division_id)return false;
		// if(task.division_id===21)return false
		return true
	}
	canChangeTaskTitle(task: Task, user: User): boolean {
		if(!(task.id>0))return true;
		return task.created_by === user?.id
				&& task.status! < 4 
	}
	canChangeTaskText(task: Task, user: User): boolean {
		return task.status! < 4 || !task.status
	}

	clearTask(){
		this.taskStore.setActiveTask(Object.assign({},TaskRepo.emptyTask));
	}

}