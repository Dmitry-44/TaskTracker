<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type Task } from "@/stores/task";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { ref, computed, nextTick, onBeforeMount, getCurrentInstance } from "vue";

const store = useTaskStore()
//GETTERS
const tasks = computed(()=>store.getList)
const activeTask = computed(()=>store.getActiveTask) 

const tasksToTake = computed(()=>tasks.value.filter(task=>task.status<=2).sort((taskA,taskB)=>taskA.priority-taskB.priority))
const tasksInProcess = computed(()=>tasks.value.filter(task=>task.status===3).sort((taskA,taskB)=>taskA.priority-taskB.priority))

//ACTIONS
const toggleDetailsWindow = store.toggleDetailsWindow
const setActiveTask = store.setActiveTask
const setCreatingTask = store.setCreatingTask
const fetchOperationsList = () => {store.fetchOperationsList().then(()=>{console.log('sss')})}
const fetchPipesList = () => {store.fetchPipesList().then(()=>{console.log('sss')})}

//HOOKS
onBeforeMount(()=> {
    fetchOperationsList()
    fetchPipesList()
})
const emptyTask = {
        id: new Date().getTime(),
        title: '',
        text: '',
        priority: 0,
        status: 0,
        pipe_id: 0,
        event_id: 0,
        division_id: 0,
        created_by: 0,
        events: [],
        event_entities: []
    }

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
                <template v-for="task in tasksToTake" :key="task.id">
                    <TaskCard 
                    :task="task" 
                    :active="task.id===activeTask?.id?true:false" 
                    @click.stop="taskClickHandler(task)"
                    @dragstart="dragstartHandler($event, task)" 
                    />
                </template>
                <el-button @click.stop="addTask()" class="column-button-footer" :icon="Plus">
                    Добавить задачу
                </el-button>
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
                <template v-for="task in tasksInProcess" :key="task.id">
                    <TaskCard 
                    :task="task" 
                    :active="task.id===activeTask?.id?true:false" 
                    @click.stop="taskClickHandler(task)"
                    @dragstart="dragstartHandler($event, task)" 
                    />
                </template>
            </div>
        </div>
    </div>
</template>


<style lang="sass" scoped>
.kanban-background
    background:#f9f8f8
    width:100%
    height:100%
    padding: 50px
    display: flex
    flex-direction: row
    position: relative
    &>div
        flex: 0 0 auto
.kanban-column
    display: flex
    flex-direction: column
    border-radius: 6px
    position: relative
    flex: 0 0 304px
    width: 304px
    height: 100%
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
.kanban-column .column-button-footer
    background-color: inherit
    margin: 0 auto
    display: flex
    border: none

.kanban-column.dragOver
    border-color: #67C23A

</style>

