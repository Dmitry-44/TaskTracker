import type { FilterPayload } from '@/api';
import type { Event } from '@/entities/event';
import type{ Operation } from '@/entities/operation';
import type { Pipe } from '@/entities/pipe';
import type { Site } from '@/entities/site';
import type { Task } from '@/entities/task';
import type { Division, User, Person } from '@/entities/user';


interface IUserStore {
    getUserIsAuth(): boolean
    getRights(): User['rights']|Object
    getUser(): User
    setIsAuth(payload: boolean): void
    setUser(payload: User): void
    setUsers(payload: Person[]): void
    setDivisions(payload: Division[]):void
    setPersons(divisionId: Division['id'], payload: Person[]): void
    getDivisionList(): Division[]
}
interface ITaskStore {
    getActiveTask(): Task
    getFilters(): FilterPayload
    setActiveTask(payload: Task): void
    setTasksList(payload: Task[]): void
    setSingleTask(payload: Task|null): void
    addNewTask(payload: Task):void
    updateTask(payload: Partial<Task>): void
    updateTaskStatus(taskId: Task['id'], status: Task['status']):void
    pushNewEventToTask(event: Event): void
    updateEvent(taskId: Task['id'], event: Partial<Event>):void
    updateEventStatus(taskId: Task['id'], eventId: Event['id'], status: Event['status']): void
    setTaskToFinish(payload: Task|null):void
    updateFilters(payload: FilterPayload):void
}
interface ICommonStore {
    getGlobalLoading(): boolean
	getIsCreatingTaskProcess(): boolean
    getDetailWindowIsOpen(): boolean
	toggleDetailsWindow(bool: boolean): void 
	toggleCreatingTaskProcess(bool: boolean): void
    showGlobalLoader(): void
    hideGlobalLoader(): void
    openFinishTaskModal(): void
    openFilters():void
    closeFilters():void
}
interface ISiteStore {
    getList(): Site[],
    setSites(payload: Site[]): void
}
interface IOperationStore {
    setOperations(payload: Operation[]): void
    setSingleOperation(payload: Operation | null): void
}
interface IPipeStore {
    setPipes(payload: Pipe[]): void
    setSinglePipe(payload: Pipe | null): void
}



export type { IUserStore, ITaskStore, ICommonStore, ISiteStore, IOperationStore, IPipeStore }