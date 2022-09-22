<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type FilterPayload, type Task } from "@/stores/task";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { ref, computed, nextTick, onBeforeMount, getCurrentInstance, watch } from "vue";

const store = useTaskStore()
//GETTERS
const tasks = computed(()=>store.getList)
const activeTask = computed(()=>store.getActiveTask) 

const tasksToTake = computed(()=>tasks.value.filter(task=>task.status!<=2).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))
const tasksInProcess = computed(()=>tasks.value.filter(task=>task.status===3).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))
const tasksFinished = computed(()=>tasks.value.filter(task=>task.status===4).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))

//ACTIONS
const toggleDetailsWindow = store.toggleDetailsWindow
const setActiveTask = store.setActiveTask
const setCreatingTask = store.setCreatingTask
const fetchOperationsList = () => {return store.fetchOperationsList()}
const fetchPipesList = () => {return store.fetchPipesList()}
const fetchTasksList = async(payload: FilterPayload) => {
    return store.fetchTasksList(payload).then(res => {
            if (
                Object.prototype.hasOwnProperty.call(res, "message") &&
                res.message === "ok"
            ){
            store.setTasksList(res.result.queryResult)
            return true;
            } else {
            return res.message || -1;
        }})}

const LOADING = ref(false)
const date = ref([new Date(new Date().getTime() - 86400 * 1000).toLocaleDateString('en-CA'), new Date().toISOString().substr(0, 10)])
const dateInt = computed(()=> {
        let dtss = Math.round(new Date(date.value[0]).getTime() / 1000)
        let dtff = Math.round(new Date(date.value[1]).getTime() / 1000)
        return {
          dts: new Date((dtss > dtff ? dtff : dtss) * 1000),
          dtf: new Date(((dtff < dtss ? dtss : dtff) + 86399) * 1000)
        }
      })
const filter = computed(() => {
    return {
        filter: {
            pipe_id: null,
            priority: [],
            ...dateInt.value
        },
        options: {
            onlyLimit: false,
            itemsPerPage: 40
        },
        select: []
    }
})

const FILTER_OPTIONS =
    {   
        STATUS: [
            {
                key: 1,
                value: 1,
                label: 'Незавершенные задачи'
            },
            {
                key: 2,
                value: 2,
                label: 'Завершенные задачи'
            },
            {
                key: 3,
                value: 3,
                label: 'Все задачи'
            }
        ],
        PRIORITY: [
            {
                key: 0,
                value: 0,
                label: 'Любой приоритет'
            },
            {
                key: 1,
                value: 1,
                label: 'Молния'
            },
            {
                key: 2,
                value: 2,
                label: 'Срочная'
            },
            {
                key: 3,
                value: 3,
                label: 'Базовая'
            },
            {
                key: 4,
                value: 4,
                label: 'Низкий'
            }
        ]
    }

//HOOKS
onBeforeMount(async()=> {
    fetchOperationsList()
    LOADING.value=true
    fetchPipesList()
    await fetchTasksList(filter.value)
    LOADING.value=false
})
watch(
() => filter,
  async (newValue, oldValue) => {
    if(filter.value.filter.priority[0]===0){
        filter.value.filter.priority=[]
    }
    LOADING.value=true
    await fetchTasksList(filter.value)
    LOADING.value=false
  },
  { deep: true }
)

//METHODS
const addTask = () => {
    setActiveTask(null)
    setCreatingTask(true)
    toggleDetailsWindow(true)
}
const taskClickHandler = (task: Task) => {
    setCreatingTask(false)
    setActiveTask(task)
    toggleDetailsWindow(true)
}
const clickOutsideCards = () => {
    toggleDetailsWindow(false)
    setActiveTask(null)
    setCreatingTask(false)
}


//DRAG AND DROP
const transferTask = ref<Task|null>(null)
const taskInProcessArea = ref<any|HTMLDivElement>(null)
const tasksToTakeArea = ref<any|HTMLDivElement>(null)
const areaParams = new Map([
    [1,{areaRef: tasksToTakeArea, status:2}],
    [2,{areaRef: taskInProcessArea, status:3}]
])
const stopAll = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const dragstartHandler= (ev: DragEvent, task: Task) => {
    console.log('drag start handler')
    transferTask.value = task
    ev.dataTransfer!.effectAllowed = "link";
}
const dragoverHandler = (ev: DragEvent, areaId: number) => {
    stopAll(ev)
    ev.dataTransfer!.effectAllowed = "link"
    const area = areaParams.get(areaId)
    if(!!transferTask.value && transferTask!.value?.status === area!.status)return false
    if(transferTask!.value?.status === 1 && area!.status === 2)return false
    area?.areaRef.value.classList.add('dragOver')
}
const dragleaveHandler = (ev: DragEvent) => {
    stopAll(ev)
    tasksToTakeArea.value.classList.remove('dragOver')
    taskInProcessArea.value.classList.remove('dragOver')
}
const dropHandler = (ev: DragEvent, area: number) => {
    ev.dataTransfer!.dropEffect = "link";
    tasks.value.map(task=>{if(task.id===transferTask?.value?.id) {task.status=areaParams.get(area)?.status || 2}})
    tasksToTakeArea.value.classList.remove('dragOver')
    taskInProcessArea.value.classList.remove('dragOver')
}

const shortcuts = [
  {
    text: 'Сегодня',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
  {
    text: 'Неделя',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Месяц',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]


</script>
<template>
    <div class="kanbar-wrapper">
        <div class="menu-top">
            <div class="filters_block">
                <el-date-picker
                    type="daterange"
                    v-model="date"
                    unlink-panels
                    range-separator="Период"
                    start-placeholder="От"
                    end-placeholder="До"
                    :shortcuts="shortcuts"
                />
                <el-select v-model="filter.filter.priority[0]" class="ml-3" placeholder="Любой приоритет">
                    <el-option
                    v-for="item in FILTER_OPTIONS.PRIORITY"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                    >
                    <span>{{ item.label }}</span>
                    </el-option>
                </el-select>
                <el-button type="warning" class="ml-3">Сбросить фильтры</el-button>
            </div>
        </div>
        <div class="kanban-background" @click.stop="clickOutsideCards()">
            <DetailsWindow />
            <div class="kanban-column" 
            @dragover="dragoverHandler($event, 1)" 
            @dragleave="dragleaveHandler($event)" 
            @drop="dropHandler($event,1)"
            ref="tasksToTakeArea" 
            >
                <div class="title">
                    <h3>К исполнению</h3>
                    <el-tooltip class="item" effect="dark" content="Добавить задачу" placement="top-start">
                        <el-button size="small" :icon="Plus" @click.stop="addTask()" />
                    </el-tooltip>
                </div>
                <div class="content">
                    <el-skeleton
                        style="width: 300px"
                        :loading="LOADING"
                        animated
                        :throttle="500"
                        >
                        <template #template>
                            <el-skeleton-item variant="rect" style="width: 300px; height: calc(100vh - 210px)" />
                        </template>
                        <template v-for="task in tasksToTake" :key="task.id">
                            <TaskCard 
                            draggable="true"
                            :task="task" 
                            :active="task.id===activeTask?.id?true:false" 
                            @click.stop="taskClickHandler(task)"
                            @dragstart="dragstartHandler($event, task)" 
                            />
                        </template>
                        <el-button @click.stop="addTask()" class="column-button-footer" :icon="Plus">
                            Добавить задачу
                        </el-button>
                    </el-skeleton>
                </div>
            </div>
            <div class="kanban-column" 
            @dragover="dragoverHandler($event,2)" 
            @dragleave="dragleaveHandler($event)" 
            @drop="dropHandler($event,2)"
            ref="taskInProcessArea" 
            >
                <div class="title">
                    <h3>В работе</h3>
                </div>
                <div class="content">
                    <el-skeleton
                    style="width: 300px"
                    :loading="LOADING"
                    animated
                    :throttle="500"
                    >
                    <template #template>
                        <el-skeleton-item variant="rect" style="width: 300px; height: calc(100vh - 210px)" />
                    </template>
                    <template v-for="task in tasksInProcess" :key="task.id">
                        <TaskCard 
                        draggable="true"
                        :task="task" 
                        :active="task.id===activeTask?.id?true:false"
                        @click.stop="taskClickHandler(task)"
                        @dragstart="dragstartHandler($event, task)" 
                        />
                    </template>
                    </el-skeleton>
                </div>
            </div>
            <div class="kanban-column">
                <div class="title">
                    <h3>Архив</h3>
                </div>
                <div class="content">
                    <el-skeleton
                    style="width: 300px"
                    :loading="LOADING"
                    animated
                    :throttle="500"
                    >
                    <template #template>
                        <el-skeleton-item variant="rect" style="width: 300px; height: calc(100vh - 210px)" />
                    </template>
                    <template v-for="task in tasksFinished" :key="task.id">
                        <TaskCard 
                        :task="task" 
                        :active="task.id===activeTask?.id?true:false"
                        @click.stop="taskClickHandler(task)"
                        />
                    </template>
                    </el-skeleton>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="sass" scoped>
.kanbar-wrapper
    display: flex
    flex-direction: column
    height: 100%
.kanban-background
    background:#f9f8f8
    width: 100%
    height: calc(100% - 70px)
    padding: 15px 50px 0px 50px
    display: flex
    flex-direction: row
    position: relative
    &>div
        flex: 0 0 auto

.menu-top
    flex: 0 0 50px
    height: 50px
    padding: 0px 24px
    display: flex
    background: #fff
    border-bottom: 1px solid #edeae9
.filters_block
    margin-left: auto
    display: flex
    align-items: center
.kanban-column
    display: flex
    flex-direction: column
    border-radius: 6px
    position: relative
    flex: 0 0 304px
    width: 310px
    max-height: calc(100% - 10px)
    max-width: 304px
    padding: 0 12px
    border: 2px solid #f9f8f8
    transition: box-shadow, border-color 250ms
    &:hover
        box-shadow: 0 0 0 1px #edeae9
    .title 
        align-items: center
        border-radius: 6px
        // cursor: pointer;
        display: flex
        position: relative
        h3
            font-size: 16px
            line-height: 20px
            // font-weight: 500
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            margin-right: auto
            display: inline-block
            position: relative
    .content
        max-height: 100%
        overflow-y: auto
        overflow-x: hidden
        padding: 0px 4px
.kanban-column .column-button-footer
    background-color: inherit
    margin: 0 auto
    display: flex
    border: none

.kanban-column.dragOver
    border-color: #67C23A

</style>

