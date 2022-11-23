<script setup lang="ts">
import { Plus, MoreFilled } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type FilterPayload, type Operation, type Task } from "@/stores/task";
import { useRouter } from "vue-router";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { onBeforeMount, ref, computed } from "vue";
import EventsModal from "../../components/kanban/EventsModal.vue";
import OperationColumn from "../../components/kanban/OperationColumn.vue";

const router = useRouter()
const taskStore = useTaskStore()
let PIPES = computed(()=>taskStore.getPipes)
const LOADING = ref(false)
const taskId = router.currentRoute.value.params.id
let task = computed<Task|null>(()=>taskStore.getSingleTask)
let taskPipe = computed(()=> PIPES.value.find(pipe=>pipe?.id===task.value?.pipe_id) || null)
const priorityOptions = useTaskStore().getPriorityOptions
const statusOptions = useTaskStore().getStatusOptions
let eventsModalOpened = ref(false)
let newEventId = ref()
let taskPriority = computed(() => {
    return priorityOptions.filter(v=>v.id===task?.value!.priority)[0]
})
const taskStatus = computed(() => {
    return statusOptions.filter(v=>v.id===task?.value!.status)[0]
})
const fetchTaskById = (payload: FilterPayload) => { return taskStore.fetchTasksList(payload)}
        
onBeforeMount(async()=> {
    LOADING.value=true
    taskStore.fetchPipesList()
    await fetchTaskById({filter: {id: Number(taskId)},options: {onlyLimit: true,itemsPerPage: 1},select: []})
    LOADING.value=false
})

const openEventsModal = () => {
    eventsModalOpened.value=true
}
const addNewEvent = (value: Operation) => {
    
}


</script>
<template>
    <div class="kanbar-wrapper">
        <div class="menu-top">
            <div class="description">
                <el-tag size="large">{{taskPipe?.name}}</el-tag>
            </div>
            <div class="tags">
                <div class="wrapper" v-if="task?.priority">
                    <el-tooltip class="item" effect="dark" :content="`Приоритет: ${taskPriority.value}`" placement="top-start">
                        <el-tag :color="taskPriority.color">{{taskPriority.value}}</el-tag>
                    </el-tooltip>
                </div>
                <div class="wrapper" v-if="task?.status">
                    <el-tooltip class="item" effect="dark" :content="`Статус: ${taskStatus.value}`" placement="top-start">
                        <el-tag :color="taskStatus.color">{{taskStatus.value}}</el-tag>
                    </el-tooltip>
                </div>
            </div>
            <div class="title">
                <el-tooltip class="item" effect="dark" content="Заголовок" placement="top-start">
                    <span>Заголовок: {{task?.title}}</span>
                </el-tooltip>
            </div>
            <div class="filters_block">
                <el-dropdown class="mr-4" style="cursor:pointer;">
                    <el-icon><MoreFilled /></el-icon>
                    <template #dropdown>
                    <el-dropdown-menu class="p-3">
                        <span>Направление</span>
                        <el-tag>{{task?.smi_direction}}</el-tag>
                        <span>Дочерние задачи</span>
                        <el-link 
                        v-for="childTask in task?.child_tasks"
                        :href="`/tasks/${childTask.id}`"
                        >
                        {{childTask.title}}
                    </el-link>
                    <span>Создана</span>
                    <el-tag>{{new Date(task!.created_at*1000).toLocaleString()}}</el-tag>
                    <el-tag>{{task?.created_by}}</el-tag>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button v-if="task?.status!=4" type="info" @click="openEventsModal()">Добавить операцию</el-button>
            </div>
        </div>
        <div class="kanban-background">
            <template v-for="operation in taskPipe?.operation_entities" :key="operation?.id">
                <OperationColumn :operation="operation" :event="task?.event_entities.find(event=>event?.operation_id===operation?.id) || null" />
            </template>
            <div class="kanban-column column-action" v-if="task?.status!=4">
                <div class="wrapper">
                    <el-tooltip class="item" effect="dark" content="Добавить операцию" placement="top-start">
                        <el-button size="large" :icon="Plus" type="info" circle  @click="openEventsModal()"/>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <EventsModal :active="eventsModalOpened" title="Список операций" @close="eventsModalOpened=false" @update="addNewEvent($event)"/>
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

.menu-top .tags
    display: flex
    align-items: center
    .wrapper
        margin-right: 8px
        max-width: 100%

.menu-top .description
    display: flex
    align-items: center
    text-transform: uppercase
    margin-right: 10px

.menu-top .title
    margin-left: 20px
    display: flex
    align-items: center
    font-weight: 600
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
    background-color: #fff 
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

.kanban-column.column-action
    background-color: inherit
    display: flex
    align-items: center
    justify-content: center
    &:hover
        box-shadow: 0 0 0 1px #edeae9

</style>