<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type Task } from "@/stores/task";
import { useInterfaceStore, type FilterPayload, } from "@/stores/interface";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { ref, computed, onBeforeUnmount } from "vue";
import Filters from "../../components/kanban/Filters.vue";
import KanbanColumn from "@/components/kanban/KanbanColumn.vue";

const taskStore = useTaskStore()
const interfaceStore = useInterfaceStore()
const $filters = ref<typeof Filters|null>(null)
const abortController = new AbortController();
const abortSignal = abortController.signal

//GETTERS
let tasks = computed(()=>taskStore.getList)
let activeTask = computed(()=>taskStore.getActiveTask) 

type withPriority={
    priority?: number
}
const topPriority = <U extends withPriority>(a: U, b: U) => a.priority! - b.priority!

let tasksToTake = computed(()=>tasks.value.filter(task=>task.status!<=2).sort(topPriority))
let tasksInProcess = computed(()=>tasks.value.filter(task=>task.status===3).sort(topPriority))
let tasksFinished = computed(()=>tasks.value.filter(task=>task.status===4).sort(topPriority))

//ACTIONS
const setActiveTask = taskStore.setActiveTask
const toggleDetailsWindow = interfaceStore.toggleDetailsWindow
const toggleCreatingTaskProcess = interfaceStore.toggleCreatingTaskProcess
const fetchTasksList = async(payload: FilterPayload) => taskStore.fetchTasksList(payload, abortSignal)

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

//METHODS
const clickOutsideCards = () => {
    $filters?.value?.closeFilters()
    toggleDetailsWindow(false)
    setActiveTask(null)
    toggleCreatingTaskProcess(false)
}
const filterUpdate = async(payload: FilterPayload) => {
    LOADING.value=true
    console.log('payload', payload)
    await fetchTasksList(payload)
    LOADING.value=false
}

//HOOKS
onBeforeUnmount(() => abortController.abort());


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
            <div class="draggable-area"
            @dragover="dragoverHandler($event, 1)" 
            @dragleave="dragleaveHandler($event)" 
            @drop="dropHandler($event,1)"
            ref="tasksToTakeArea" 
            >
                <KanbanColumn 
                :tasks="tasksToTake" 
                title="К исполнению" 
                :add-New-Task="true" 
                :is-Draggable="true" 
                @taskDragStart="dragstartHandler"
                />
            </div>
            <div class="draggable-area"
            @dragover="dragoverHandler($event,2)" 
            @dragleave="dragleaveHandler($event)" 
            @drop="dropHandler($event,2)"
            ref="taskInProcessArea"
            >
                <KanbanColumn 
                :tasks="tasksInProcess" 
                title="В работе" 
                :is-Draggable="true" 
                @taskDragStart="dragstartHandler"
                />
            </div>
            <KanbanColumn :tasks="tasksFinished" title="Архив" />
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
    margin-right: auto

.draggable-area
    max-height: calc(100% - 10px)
    border-radius: 6px
    transition: all .2s 
.draggable-area.dragOver
    outline: 2px solid #67C23A

@media screen and (max-width: 1024px)
    .kanban-background
        width: fit-content

</style>