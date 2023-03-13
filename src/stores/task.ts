import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { errRequestHandler } from "@/plugins/errorResponser";
import { envConfig } from "@/plugins/envConfig";
import { type FilterPayload, type SimpleObject, type ResultWithMessage, useInterfaceStore, type ApiResponse, isSuccessApiResponse } from "@/stores/interface";


interface Task {
  id: number;
  title: string;
  text: string;
  created_at: number;
  priority?: number;
  status?: number;
  pipe_id?: number;
  event_id?: number;
  division_id?: number;
  created_by?: number;
  events?: number[];
  event_entities?: Event[],
  child_tasks?: Task[],
  smi_direction?: number,
}
const taskDefault: ActiveTask = {
  id: -1,
  title: '',
  created_at: -1,
  status: 1,
  text: '',
}
interface ActiveTask extends Task {
  readonly?: boolean
}
type Event = {
  id: number
  task_id?: number
  operation_id?: number
  created: number
  modified: number | null
  finished?: number | null
  u_id?: number | null
  user_name?: string | null
  status: number
  selected_users: number[]
  result?: string | null
  params?: SimpleObject
}
interface TaskOption {
  id: number,
  value: string,
  color: string
}
interface EventStatusOption {
  id: number,
  value: string,
  color: string
}
interface State {
  tasks: Task[]
  singleTask: Task|null
  priorityOptions: TaskOption[]
  statusOptions: TaskOption[]
  eventStatusOptions: EventStatusOption[]
  activeTask: ActiveTask,
  filterBase: FilterPayload,
  filterVersion: string
}

export type { Task, ActiveTask, Event };

export const useTaskStore = defineStore({
  id: "task",
  state: (): State => ({
    priorityOptions: [
      {id:1,value:'Молния',color:'#E6A23C'},
      {id:2,value:'Срочная',color:'#F56C6C'},
      {id:3,value:'Базовая',color:'#409EFF'},
      {id:4,value:'Низкая',color:'#909399'},
    ],
    statusOptions: [
      {id:1,value:'Создана',color:'#f06a6a'},
      {id:2,value:'Обработана',color:'#4ecbc4'},
      {id:3,value:'В работе',color:'#f8df72'},
      {id:4,value:'Закончена',color:'#909399'},
    ],
    eventStatusOptions: [
      {id:1,value:'Создана',color:''},
      {id:2,value:'В работе',color:'#f8df72'},
      {id:3,value:'Готово',color:'#67C23A'},
    ],
    activeTask: {...taskDefault},
    tasks: [],
    singleTask: null,
    filterBase: {
      select: [],
      filter: {},
      options: {
        onlyLimit: false,
        page: 1,
        itemsPerPage: 50,
        sortBy: ['id'],
        sortDesc: [false],
        groupBy: [],
        groupDesc: [false],
        mustSort: false,
        multiSort: false,
      }
    },
    filterVersion: '1.0',
  }),
  getters: {
    getList: (state): Task[] => state.tasks,
    getSingleTask: (state) => state.singleTask,
    getFilterVersion:(state): string => state.filterVersion,
    getPriorityOptions: (state): TaskOption[] => state.priorityOptions,
    getStatusOptions: (state): TaskOption[] => state.statusOptions,
    getActiveTask:(state)=> state.activeTask,
    getEventStatusOptions:(state): EventStatusOption[]=> state.eventStatusOptions
  },
  actions: {
    setActiveTask(task: Task | null): void {
      const interfaceStore = useInterfaceStore()
      if(this.activeTask?.id == task?.id && !interfaceStore.getIsCreatingTaskProcess)return;
      this.activeTask = task || {...taskDefault}
    },
    setTasksList(payload: Task[]): void {
      this.tasks=payload
    },
    setSingleTask(payload: Task[]):void {
      this.singleTask=payload[0]
    },
    
    async fetchTasksList(filterPayload?: FilterPayload|Partial<FilterPayload>, signal?: AbortSignal): Promise<string|boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}tasktracker/tasks`, {...this.filterBase, ...filterPayload}, {signal})
        .then((resp) => {
          const respdata: ApiResponse = resp.data;
          if(isSuccessApiResponse(respdata)) {
            if(filterPayload?.filter!['id']) {
              this.setSingleTask(respdata.result.queryResult as Task[])
            } else {
              this.setTasksList(respdata.result.queryResult as Task[]);
            }
            return true;
          } else {
              return respdata.message || -1;
            }
        })
        .catch((e) => errRequestHandler(e));
    },
    async upsertTask(payload: Partial<Task>|Task): Promise<string|boolean> {
      console.log('upsertTask')
      return axiosClient
        .post(`${envConfig.API_URL}tasktracker/taskUpsert`, payload)
        .then((resp) => {
          const respdata: ApiResponse = resp.data;
          if(isSuccessApiResponse(respdata)) {
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    async takeTask(id: number): Promise<string|boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}tasktracker/takeTaskSmi`, {id: id})
        .then((resp) => {
          const respdata: ApiResponse = resp.data;
          if(isSuccessApiResponse(respdata)) {
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
}
});
