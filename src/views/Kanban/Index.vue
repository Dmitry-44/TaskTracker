<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type FilterPayload, type Task } from "@/stores/task";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { ref, computed, nextTick, onBeforeMount, getCurrentInstance, watch } from "vue";
import Filters from "../../components/kanban/Filters.vue";

const store = useTaskStore()
const $filters = ref(null)
//GETTERS
let tasks = computed(()=>store.getList)
let activeTask = computed(()=>store.getActiveTask) 

let tasksToTake = computed(()=>tasks.value.filter(task=>task.status!<=2).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))
let tasksInProcess = computed(()=>tasks.value.filter(task=>task.status===3).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))
let tasksFinished = computed(()=>tasks.value.filter(task=>task.status===4).sort((taskA,taskB)=>taskA.priority!-taskB.priority!))

//ACTIONS
const toggleDetailsWindow = store.toggleDetailsWindow
const setActiveTask = store.setActiveTask
const setCreatingTask = store.setCreatingTask
const fetchTasksList = async(payload: FilterPayload) => {return store.fetchTasksList(payload)}
const takeTask = async(taskId: Partial<Task>) => { 
    console.log('taskId', taskId)
    return store.takeTask({id:+taskId})
}

const LOADING = ref(false)

let filter = ref<FilterPayload>(
    {
        filter: {
            pipe_id: null,
            priority: [],
        },
        options: {
            onlyLimit: false,
            itemsPerPage: 40
        },
        select: []
    }
)
//HOOKS
onBeforeMount(async()=> {
    LOADING.value=true
    store.fetchPipesList()
    LOADING.value=false
})

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
    $filters?.value?.closeFilters()
    toggleDetailsWindow(false)
    setActiveTask(null)
    setCreatingTask(false)
}
const filterUpdate = async(payload: FilterPayload) => {
    LOADING.value=true
    console.log('payload', payload)
    await fetchTasksList(payload)
    LOADING.value=false
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

</script>
<template>
    <div class="kanbar-wrapper">
        <div class="menu-top">
            <div class="filters-wrapper">
                <Filters 
                @update="filterUpdate($event)"
                ref="$filters"
                />
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
                            @take="takeTask($event)"
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
.filters-wrapper
    display: flex
    margin-left: auto
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