import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { errRequestHandler } from "@/plugins/errorResponser";
import { envConfig } from "@/plugins/envConfig";

interface Task {
  id: number;
  title: string;
  text: string;
  priority: number;
  status: number;
  pipe_id: number;
  event_id: number;
  division_id: number;
  created_by: number;
  events?: number[];
  event_entities: Event[]
}

const taskDefault: Task = {
  id: -1000,
  title: '',
  text: '',
  priority: -1,
  status: -1,
  pipe_id: -1,
  event_id: -1,
  division_id: -1,
  created_by: -1,
  events: [],
  event_entities:[],
}

interface Event {
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
  params?: object
}

interface Pipe {
  id: number,
  name: string,
  value: number[]
}
interface Operation {
  id: number;
  name: string
  params: Object

}

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

interface State {
  tasks: Task[]
  priorityOptions: TaskOption[]
  statusOptions: TaskOption[]
  detailsWindow: DetailsWindow
  activeTask: Task,
  pipes: Pipe[]
  operations: Operation[]
}

interface PaginationBack {
  allCount: number;
  maxPages: number;
  page: number;
}

export type { Task, Event };

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
    detailsWindow: {
      isOpened: false,
      creatingTask: false,
    },
    activeTask: taskDefault,
    tasks: [
      {
        "id": 245166,
        "pipe_id": 1,
        "priority": 1,
        "status": 2,
        "division_id": 1,
        "created_by": 262,
          "title": "НЕВЕРНАЯ СУПРУГА ",
          "text": "<p>https://yandex.ru/news/instory/VPodmoskove_muzhchina_zazhivo_szheg_nevernuyu_suprugu_i_poluchil_sem_let--f37a0982372586da24d67bac05892144?lr=120590&amp;content=alldocs&amp;stid=5VB6Ah30&amp;persistent_id=221549503&amp;from=story</p>",
          "event_id": 542563,
          "events": [
              542564
          ],
          "event_entities": [
              {
                  "id": 542564,
                  "task_id": 245166,
                  "operation_id": 1,
                  "created": 1662017005,
                  "modified": 1662017048,
                  "finished": null,
                  "u_id": 436,
                  "user_name": "Исламгалиева Альфия Ильшатовна",
                  "status": 2,
                  "selected_users": [],
                  "result": null,
                  "params": {
                      "id": 23620750,
                      "direction": 23,
                      "time": 0,
                      "started_at": 1662017047.657
                  }
              }
          ]
      },
      {
        "id": 245199,
        "pipe_id": 1,
        "priority": 3,
        "status": 2,
        "division_id": 1,
        "created_by": 262,
          "title": "Новый дворец Путина",
          "text": "<p>https://yandex.ru/news/instory/VPodmoskove_muzhchina_zazhivo_szheg_nevernuyu_suprugu_i_poluchil_sem_let--f37a0982372586da24d67bac05892144?lr=120590&amp;content=alldocs&amp;stid=5VB6Ah30&amp;persistent_id=221549503&amp;from=story</p>",
          "event_id": 542553,
          "events": [
              542563
          ],
          "event_entities": [
              {
                  "id": 542563,
                  "task_id": 245199,
                  "operation_id": 1,
                  "created": 1662017005,
                  "modified": 1662017048,
                  "finished": null,
                  "u_id": 436,
                  "user_name": "Исламгалиева Альфия Ильшатовна",
                  "status": 2,
                  "selected_users": [],
                  "result": null,
                  "params": {
                      "id": 23620750,
                      "direction": 23,
                      "time": 0,
                      "started_at": 1662017047.657
                  }
              }
          ]
      },
      {
        "id": 245207,
        "pipe_id": 1,
        "priority": 2,
        "status": 3,
        "division_id": 1,
        "created_by": 262,
          "title": "ЭВАКУИРУЮТ ВЕРНАДСКОГО",
          "text": "<p>https://t.me/vesticrimea/5747</p>",
          "event_id": 542638,
          "events": [
              542639,
              542656,
              542661
          ],
          "event_entities": [
            {
                "id": 542639,
                "task_id": 245207,
                "operation_id": 1,
                "created": 1662017699,
                "modified": 1662017719,
                "finished": null,
                "u_id": 436,
                "user_name": "Исламгалиева Альфия Ильшатовна",
                "status": 3,
                "selected_users": [],
                "result": null,
                "params": {
                    "id": 23620774,
                    "direction": 23,
                    "time": 0,
                    "started_at": 1662017719.034
                }
            },
            {
                "id": 542656,
                "task_id": 245207,
                "operation_id": 2,
                "created": 1662017983,
                "modified": 1662018015,
                "finished": null,
                "u_id": 436,
                "user_name": "Исламгалиева Альфия Ильшатовна",
                "status": 3,
                "selected_users": [],
                "result": null,
                "params": {
                    "started_at": 1662018015
                }
            },
            {
                "id": 542661,
                "task_id": 245207,
                "operation_id": 3,
                "created": 1662018015,
                "modified": null,
                "finished": null,
                "u_id": null,
                "user_name": null,
                "status": 3,
                "selected_users": [],
                "result": null,
                "params": {
                    "site_id": 3
                }
            }
          ]
        }
      ],
      pipes: [
        {
            "id": 1,
            "name": "Публикация новости",
            "value": [
                1,
                2,
                3
            ]
        },
        {
            "id": 2,
            "name": "Опуликовать новости на сайты",
            "value": [
                4
            ]
        }
      ],
      operations: [
        {
            "id": 1,
            "name": "Написать новость",
            "params": {
                "id": 0,
                "direction": 0,
                "time": 0
            }
        },
        {
            "id": 2,
            "name": "Проверить новость",
            "params": {
                "started_at": 0
            }
        },
        {
            "id": 3,
            "name": "Опубликовать новость",
            "params": {
                "site_id": 0
            }
        },
        {
          "id": 4,
          "name": "Поставить задачи на публикацию на сайты",
          "params": {
              "site_ids": [],
              "directionArr": [
                  {
                      "id": 0,
                      "name": "Без направления",
                      "disabled": false
                  },
                  {
                      "id": 21,
                      "name": "Политика",
                      "disabled": false
                  },
                  {
                      "id": 22,
                      "name": "Общество",
                      "disabled": false
                  },
                  {
                      "id": 23,
                      "name": "Происшествия",
                      "disabled": false
                  },
                  {
                      "id": 24,
                      "name": "Экономика",
                      "disabled": false
                  },
                  {
                      "id": 25,
                      "name": "Развлечения",
                      "disabled": false
                  },
                  {
                      "id": 26,
                      "name": "Армия и ОПК",
                      "disabled": false
                  },
                  {
                      "id": 27,
                      "name": "Ночь",
                      "disabled": false
                  },
                  {
                      "id": 28,
                      "name": "Дзен",
                      "disabled": false
                  }
              ],
              "direction": 0,
              "auto": true,
              "selected_users": [],
              "time": 0
          }
        },
    ]
  }),
  getters: {
    getList: (state): Task[] => state.tasks || [],
    getTaskById: (state) => {
      return (taskId: number) => state.tasks.find((task) => task.id === taskId)
    },
    getDetailsWindow:(state): DetailsWindow => state.detailsWindow,

    getPriorityOptions: (state): TaskOption[] => {
      return state.priorityOptions
    },
    getStatusOptions: (state): TaskOption[] => {
      return state.statusOptions
    },
    getActiveTask:(state)=> state.activeTask,
    getPipes:(state): Pipe[] => state.pipes,
    getOperations:(state): Operation[] => state.operations,
    getCreatingTask:(state) => state.detailsWindow.creatingTask

  },
  actions: {
    toggleDetailsWindow(payload: boolean): void {
      this.detailsWindow.isOpened = payload
    },
    setActiveTask(task: Task | null): void {
      if(this.activeTask?.id === task?.id)return;
      this.activeTask = task || taskDefault
    },
    addNewTAsk(task: Task): void {
      this.tasks.push(task)
    },
    setCreatingTask(bool: boolean): void {
      this.detailsWindow.creatingTask=bool
    },

    fetchListMain(): Promise<boolean> {
      const options = JSON.parse(JSON.stringify(this.optionsSettings));
      return axiosClient
        .post(`${envConfig.API_URL}watermark/getList`, options)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setImageList(respdata.result);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    setImageList(payload: ImagesListWithPagination): void {
      this.imageList = payload.data || [];
      this.imageList.forEach((img) => {
        img.isWatermark = true;
        img.preview = `${envConfig.API_URL}${img.path}`;
        return img;
      });
      this.optionsSettings.options.allCount = payload.allCount;
      this.optionsSettings.options.page = payload.page;
      this.optionsSettings.options.maxPages = payload.maxPages;
    },
    sendDeleteWatermark(id: number): Promise<boolean> {
      return axiosClient
        .delete(`${envConfig.API_URL}watermark/${id}`)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
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
    sendImage(payload: Watermark): Promise<boolean> {
      const form = new FormData();
      form.append("file", payload.blob);
      form.append("name", payload.name);
      form.append("type", payload.type.toString());
      return axiosClient
        .post(`${envConfig.API_URL}watermark/`, form)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
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
  },
});
