import router from '@/router';
import { TaskStatus, emptyTask, validateTask } from '@/entities/task';
import { ElMessage } from 'element-plus';
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { isSuccessApiResponse, isResultWithPagination, type FilterPayload, type WSTaskChannelMessage, WSEvents } from "@/api";
import type { ITaskRepo, Task } from "@/entities/task";
import type { ITaskStore, ICommonStore, IUserStore } from '@/adapters';
import { EventStatus, type Event } from '@/entities/event';
import type { Division, User } from '@/entities/user';
import { WebSocketIsConnected } from '@/plugins/io';
import { lastFromArray } from '@/plugins/utils';
import { services } from '@/main';


export default class TaskService {

	taskRepo;
	commonStore;
	taskStore;
	userStore;

	constructor(taskRepo: ITaskRepo, taskStore: ITaskStore, commonStore: ICommonStore, userStore: IUserStore) {
		this.taskRepo = taskRepo;
		this.taskStore = taskStore;
		this.commonStore=commonStore;
		this.userStore = userStore;
	}

	async fetchTasks (payload?: FilterPayload, signal?: AbortSignal): Promise<boolean> {
		return this.taskRepo
			.GetTasks(payload, signal)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							this.taskStore.setSingleTask(respdata.result.data[0]);
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
							? respdata.result.data
							: respdata.result

						this.taskStore.setTasksList(tasks);
					}
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err))
	}

	async upsertTask(payload: Partial<Task>): Promise<boolean> {
		const validateTaskResult = validateTask(payload)
		if(validateTaskResult != true){
			ElMessage({
				message: validateTaskResult.message,
				type: "info",
				center: true,
				duration: 2000,
				showClose: true,
			});
			return false
		};
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

	async takeTask(task: Task, user: User): Promise<boolean> {
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
		const taskLastEvent = lastFromArray(task.event_entities!)
		if(!taskLastEvent)return false;
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
					// if (!WebSocketIsConnected) {
					// 	const message: WSTaskChannelMessage = {
					// 		type: WSEvents.EVENT_STATUS_UPDATE,
					// 		data: {
					// 			task_id: taskId,
					// 			id: eventId,
					// 			status
					// 		}
					// 	}
					// 	services.taskStoreUpdater.update(message)
					// }
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

	completeEvent(taskId: Task['id'], eventId: Event['id'], eventResult: Event['result']): Promise<boolean> {
		const msg = ElMessage({
			message: "Обновляю статус задачи..",
			type: "success",
			center: true,
			duration: 1000,
		});
		return this.taskRepo
			.CompleteEvent(taskId, eventId, eventResult)
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
			!this.commonStore.getIsCreatingTaskProcess()
		)
			return;
		payload  
			? this.taskStore.setActiveTask(payload)
			: this.taskStore.setActiveTask(Object.assign({},emptyTask));
	}

	clickTask(task: Task) {
		this.taskStore.setActiveTask(task)
		this.commonStore.toggleCreatingTaskProcess(false)
		this.commonStore.toggleDetailsWindow(true)
	}

	clickOutsideTaskCard(){
		this.commonStore.toggleDetailsWindow(false)
		this.commonStore.toggleCreatingTaskProcess(false)
		this.taskStore.setActiveTask(Object.assign({},emptyTask))
	}

	createNewTask(){
		this.commonStore.toggleCreatingTaskProcess(true)
		this.taskStore.setActiveTask(Object.assign({},emptyTask))
		this.commonStore.toggleDetailsWindow(true)
	}

	closeDetailWindow(){
		this.commonStore.toggleDetailsWindow(false),
		this.setActiveTask(Object.assign({},emptyTask)),
		this.commonStore.toggleCreatingTaskProcess(false)
	}

	openTaskInNewTab(task: Task){
		const routeData = router.resolve({ path: `/tasks/${task.id}` });
  		window.open(routeData.href, "_blank");
	}

	searchTasks(tasksList: Task[], search: string): Task[] {
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
		if(newEventStatus<EventStatus.CREATED || newEventStatus>EventStatus.COMPLETED){
			return false
		}
		const eventToUpdate = lastFromArray(task.event_entities!)
		if(!eventToUpdate)return false;
		if(eventToUpdate.status === newEventStatus)return false;
		switch (newEventStatus) {
			case EventStatus.CREATED:
				return this.returnTaskToBacklog(task, user)
				break;
			case EventStatus.IN_PROGRESS:
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
			case EventStatus.COMPLETED:
				const canFinishTask = this.canFinishTask(task, user)
				if(!canFinishTask){
					ElMessage({
						message: "Вы не можете завершить данную задачу",
						type: "info",
						center: true,
						duration: 1500,
						showClose: true,
					})
					return false
				}
				this.taskStore.setTaskToFinish(Object.assign({}, task))
    			this.commonStore.openFinishTaskModal()
				return true
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
			const eventToUpdate = lastFromArray(task.event_entities!)
			if(!eventToUpdate)return false;
			return this.updateEventStatus(task.id, eventToUpdate.id, EventStatus.CREATED)
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
			const eventToUpdate = lastFromArray(task.event_entities!)
			if(!eventToUpdate)return false;
			return this.updateEventStatus(task.id, eventToUpdate.id, EventStatus.IN_PROGRESS)
		}
	}
	async finishTask(task: Task, user: User, eventResult: Event['result']): Promise<boolean> {
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
			const eventToUpdate = lastFromArray(task.event_entities!)
			if(!eventToUpdate)return false;
			return this.completeEvent(task.id, eventToUpdate.id, eventResult)
		}
	}

	canTakeTask(task: Task, user: User): boolean {
		const taskLastEvent = lastFromArray(task.event_entities!)
		if(!taskLastEvent){return false};
		return ((taskLastEvent.selected_users.length===0 && taskLastEvent.selected_divisions.length===0) || taskLastEvent.selected_users.includes(user.id))
				&& !taskLastEvent.u_id
				&& taskLastEvent.status === EventStatus.CREATED
	}
	canTakeTaskToProgress(task: Task, user: User): boolean {
		const taskLastEvent = lastFromArray(task.event_entities!)
		if(!taskLastEvent){return false};
		return taskLastEvent.u_id===user.id
			&& taskLastEvent.status === EventStatus.CREATED
	}
	canReturnTaskToBacklog(task: Task, user: User): boolean {
		const taskLastEvent = lastFromArray(task.event_entities!)
		if(!taskLastEvent){return false};
		return ((taskLastEvent.selected_users.length===0 && taskLastEvent.selected_divisions.length===0) || taskLastEvent.selected_users.includes(user.id))
				&& taskLastEvent.u_id === user.id
				&& taskLastEvent.status === EventStatus.IN_PROGRESS
	}
	canFinishTask(task: Task, user: User): boolean {
		const taskLastEvent = lastFromArray(task.event_entities!)
		if(!taskLastEvent){return false};
		return taskLastEvent.u_id===user.id && taskLastEvent.status === EventStatus.IN_PROGRESS
	}
	canChangeTaskPriority(task: Task, user: User): boolean {
		if(!(task.id>0))return true;
		return task.created_by === user?.id
				&& (task.status != TaskStatus.COMPLETED || !task.status)
	}
	canChangeTaskPipeline(task: Task, user: User): boolean {
		return !(task.id>0)
	}
	canSetTaskPipeline(task: Task, user: User): boolean {
		if(task.id>0)return true;
		// if(!task.division_id)return false;
		const division = this.userStore.getDivisionList().find(division=>division.id===task.division_id)
		if(!division)return false;
		const isUserMemberOfCurrentDivision = division.ttrace_ids.includes(user.selected_group)
				//если я являюсь участником выбранного подразделения
		return isUserMemberOfCurrentDivision
				//если у меня есть право
				// && user.rights['tt_task_accept']>=1
	}
	canChangeTaskTitle(task: Task, user: User): boolean {
		if(!(task.id>0))return true;
		return task.created_by === user?.id
				&& task.status! < TaskStatus.COMPLETED 
	}
	canChangeTaskText(task: Task, user: User): boolean {
		return task.status! < TaskStatus.COMPLETED || !task.status
	}
	canChangeTaskDivision(task: Task, user: User): boolean {
		return task.id < 0
	}
	canChangeEventParams(task: Task, user: User): boolean {
		// user.id=33
		//если у меня есть право
		// && user.rights['tt_task_accept']>=1
		return task.id<0 || task.created_by===user.id 
	}
	canChangeEventExecutors(task: Task, user: User): boolean {
		//TO DO + право пользователя на выбор исполнителя
		const division = this.userStore.getDivisionList().find(division=>division.id===task.division_id)
		if(!division)return false;
		return task.id<=0 && division?.ttrace_ids?.includes(user.selected_group)
	}

	clearTask(){
		this.taskStore.setActiveTask(Object.assign({},emptyTask));
	}


}