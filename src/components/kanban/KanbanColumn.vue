<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import {useTaskStore, type Task} from '@/stores/task'
import { toRef, type PropType } from 'vue';
import { ref, computed } from '@vue/reactivity';
import { Plus } from '@element-plus/icons-vue';
import { useInterfaceStore } from '@/stores/interface';
import { ElMessage } from "element-plus";
import { errVueHandler } from '@/plugins/errorResponser';

const props = defineProps({
    tasks: {
        type: Object as PropType<Task[]>,
        default: []
    },
    title: {
        type: String,
        default: ''
    },
    addNewTask: {
        type: Boolean,
        default: false
    },
    isDraggable: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits<{
  (e: 'taskDragStart', ev: DragEvent, task: Task): void
}>()

const taskStore = useTaskStore()
const interfaceStore = useInterfaceStore()

//GETTERS
let activeTask = computed(()=>taskStore.getActiveTask) 

//ACTIONS
const setActiveTask = taskStore.setActiveTask
const toggleDetailsWindow = interfaceStore.toggleDetailsWindow
const toggleCreatingTaskProcess = interfaceStore.toggleCreatingTaskProcess

const LOADING = toRef(props, 'loading')
let searchValue = ref('')
let tasks = toRef(props, 'tasks')


//METHODS
const addTask = () => {
    setActiveTask(null)
    toggleCreatingTaskProcess(true)
    toggleDetailsWindow(true)
}
const taskClickHandler = (task: Task) => {
    toggleCreatingTaskProcess(false)
    setActiveTask(task)
    toggleDetailsWindow(true)
}
const takeTask = async(taskId: Task["id"]) => { 
    LOADING.value=true
    const msg = ElMessage({
        message: "Хватаю задачу..",
        type: "success",
        center: true,
        duration: 1000,
    });
    taskStore.takeTask(taskId)
    .then(res=>{
        console.log('res', res)
        if (errVueHandler(res)) {
            ElMessage({
                message: "Операция выполнена успешно!",
                type: "success",
                center: true,
                duration: 1500,
                showClose: true,
            });
        }
    })
    .finally(()=>{
        LOADING.value=false
        msg.close()
    })
}

const doSearch = () => {
    tasks.value=props.tasks
    tasks.value=tasks.value.filter(task=>task.title.concat(' ',task.text).toLowerCase().indexOf(searchValue.value.toLowerCase()) !== -1)
}

</script>


<template>
    <div class="kanban-column">
        <div class="title">
            <h3>{{ title }}</h3>
            <el-input v-model="searchValue" clearable @input="doSearch" size="small" placeholder="Поиск" />
            <template v-if="addNewTask">
                <el-tooltip class="item" effect="dark" content="Добавить задачу" placement="top-start">
                    <el-button size="small" :icon="Plus" @click.stop="addTask()" />
                </el-tooltip>
            </template>
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
                <template v-for="task in tasks" :key="task.id">
                    <TaskCard 
                    :draggable=isDraggable
                    :task="task" 
                    :active="task.id===activeTask?.id?true:false" 
                    @click.stop="taskClickHandler(task)"
                    @dragstart="emit('taskDragStart', $event, task)"
                    @take="takeTask($event)"
                    />
                </template>
                <el-button v-if="addNewTask" @click.stop="addTask()" class="column-button-footer" :icon="Plus">
                    Добавить задачу
                </el-button>
            </el-skeleton>
        </div>
    </div>
</template>

<style lang="sass">
.kanban-column
    display: flex
    flex-direction: column
    border-radius: 6px
    position: relative
    flex: 0 0 304px
    width: 310px
    margin: 0 5px
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
        display: flex
        position: relative
        h3
            font-size: 16px
            line-height: 20px
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            margin-right: auto
            display: inline-block
            position: relative
            flex-shrink: 0
            margin-right: 5px
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
</style>