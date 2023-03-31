import type{ Operation } from '@/types/operation';
import type { Pipe } from '@/types/pipe';
import type { Site } from '@/types/site';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';


interface IUserStore {
    getUserIsAuth(): boolean
    getRights(): User['rights']|Object
    getUser(): User|null
    setIsAuth(payload: boolean): void
    setUser(payload: User|null): void
}
interface ITaskStore {
    getActiveTask(): Task
    setActiveTask(payload: Task): void
    setTasksList(payload: Task[]): void
    setSingleTask(payload: Task|null): void
}
interface IInterfaceStore {
    getGlobalLoading(): boolean
	getIsCreatingTaskProcess(): boolean
    getDetailWindowIsOpen(): boolean
	toggleDetailsWindow(bool: boolean): void 
	toggleCreatingTaskProcess(bool: boolean): void
    showGlobalLoader(): void
    hideGlobalLoader(): void
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



export type { IUserStore, ITaskStore, IInterfaceStore, ISiteStore, IOperationStore, IPipeStore }