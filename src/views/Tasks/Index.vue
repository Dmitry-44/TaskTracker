<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type FilterPayload, type Task } from "@/stores/task";
import { useRouter } from "vue-router";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { onBeforeMount, ref, computed } from "vue";

const router = useRouter()
const taskStore = useTaskStore()
const OPERATIONS = computed(()=>taskStore.getOperations)
const LOADING = ref(false)
const taskId = router.currentRoute.value.params.id
const task = ref<Task>()
const fetchTaskById = (payload: FilterPayload) => { return taskStore.fetchTasksList(payload).then(res => {
            if (
                Object.prototype.hasOwnProperty.call(res, "message") &&
                res.message === "ok"
            ){
            const [data] = res.result.queryResult
            task.value = data
            return true;
            } else {
            return res.message || -1;
        }})
    }
        
onBeforeMount(async()=> {
    LOADING.value=true
    taskStore.fetchOperationsList().then(res=> {
      if (
          Object.prototype.hasOwnProperty.call(res, "message") &&
          res.message === "ok"
        ) {
          res.result
          taskStore.setOperationsList(res.result)
          return true;
        } else {
          return res.message || -1;
        }
    })
    await fetchTaskById({filter: {id: Number(taskId)},options: {onlyLimit: true,itemsPerPage: 1},select: []})
    LOADING.value=false
})

const clickOutsideCards = () => {
    // toggleDetailsWindow(false)
    // setActiveTask(null)
    // setCreatingTask(false)
}


</script>
<template>
    <div class="kanbar-wrapper">
        <div class="menu-top">
            <div class="filters_block">
                <!-- <el-date-picker
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
                <el-button type="warning" class="ml-3">Сбросить фильтры</el-button> -->
            </div>
        </div>
        <div class="kanban-background" @click.stop="clickOutsideCards()">
            <DetailsWindow />
            <div class="kanban-column" v-for="event in task?.event_entities" :key="event?.id">
                <div class="title">
                    <h3>{{OPERATIONS.find(oper=>oper.id===event.operation_id)?.name}}</h3>
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
                    <!-- <template v-for="task in tasksInProcess" :key="task.id">
                        <TaskCard 
                        draggable="true"
                        :task="task" 
                        :active="task.id===activeTask?.id?true:false"
                        @click.stop="taskClickHandler(task)"
                        @dragstart="dragstartHandler($event, task)" 
                        />
                    </template> -->
                    </el-skeleton>
                </div>
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
    transition: box-shadow 250ms
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

</style>

