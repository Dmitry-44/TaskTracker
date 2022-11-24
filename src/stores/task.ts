import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { errRequestHandler } from "@/plugins/errorResponser";
import { envConfig } from "@/plugins/envConfig";

export interface SimpleObject {
  [key: string]: any;
}
interface Task {
  id?: number;
  title: string;
  text: string;
  created_at: number;
  priority?: number;
  status?: number;
  pipe_id?: number;
  event_id: number;
  division_id: number;
  created_by: number;
  events?: number[];
  event_entities: Event[],
  child_tasks?: Task[],
  smi_direction?: number,
}
const taskDefault: ActiveTask = {
  title: '',
  created_at: -1,
  text: '',
  event_id: -1,
  division_id: -1,
  created_by: -1,
  events: [],
  event_entities:[],
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
} | null

interface DetailsWindow {
  isOpened: boolean
  creatingTask: boolean
}
interface ResultWithMessage {
  message: string;
  result: any;
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
  detailsWindow: DetailsWindow
  activeTask: ActiveTask,
  filterBase: FilterPayload,
  filterVersion: string
}
interface FilterPayload {
  select: string[];
  filter: SimpleObject;
  options: {
    onlyLimit: boolean;
    page?: number;
    itemsPerPage: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    groupBy?: string[];
    groupDesc?: boolean[];
    mustSort?: boolean;
    multiSort?: boolean;
    allCount?: number;
    maxPages?: number;
  };
}

export type { Task, ActiveTask, Event, FilterPayload, ResultWithMessage };

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
    detailsWindow: {
      isOpened: false,
      creatingTask: false,
    },
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
    getList: (state): Task[] => state.tasks || [],
    getSingleTask: (state) => {return state.singleTask},
    getDetailsWindow:(state): DetailsWindow => state.detailsWindow,
    getFilterVersion:(state): string => state.filterVersion,
    getPriorityOptions: (state): TaskOption[] => state.priorityOptions,
    getStatusOptions: (state): TaskOption[] => state.statusOptions,
    getActiveTask:(state)=> state.activeTask,
    getCreatingTask:(state) => state.detailsWindow.creatingTask,
    getEventStatusOptions:(state): EventStatusOption[]=> state.eventStatusOptions
  },
  actions: {
    toggleDetailsWindow(payload: boolean): void {
      this.detailsWindow.isOpened = payload
    },
    setActiveTask(task: Task | null): void {
      if(this.activeTask?.id == task?.id && !this.detailsWindow.creatingTask)return;
      this.activeTask = task || {...taskDefault}
    },
    addNewTAsk(task: Task): void {
      this.tasks.push(task)
    },
    setCreatingTask(bool: boolean): void {
      this.detailsWindow.creatingTask=bool
    },
    setTasksList(payload: Task[]): void {
      this.tasks=payload
    },
    setSingleTask(payload: Task[]):void {
      this.singleTask=payload[0]
    },
    
    fetchTasksList(filterPayload?: FilterPayload|Partial<FilterPayload>, signal?: AbortSignal): Promise<ResultWithMessage> {
      return axiosClient
        .post(`${envConfig.API_URL}tasktracker/tasks`, {...this.filterBase, ...filterPayload}, {signal})
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            if(filterPayload?.filter!['id']) {
              this.setSingleTask(respdata.result.queryResult)
            } else {
              this.setTasksList(respdata.result.queryResult);
            }
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    upserTask(payload: Partial<Task>): Promise<boolean> {
      return axiosClient
        .put(`${envConfig.API_URL}tasktracker/smiCenterTaskUpsert`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
  },
}
});
