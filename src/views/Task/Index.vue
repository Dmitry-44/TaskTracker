<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore } from "@/stores/task";
import { useRouter } from "vue-router";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";

const router = useRouter()
const taskId = router.currentRoute.value.params.id
const task = useTaskStore().getTaskById(Number(taskId))

const pipes = useTaskStore().getPipes
const operations = useTaskStore().getOperations
const taskPipe = pipes.filter(pipe=>pipe.id===task?.pipe_id)
const taskOperations=taskPipe[0].value.map(id => operations.find(val=> val.id===id))
const taskLastEvent = task?.event_entities[task?.event_entities.length-1]

</script>
<template>
    <div class="kanban-background">
        <div class="kanban-column" v-for="operation in taskOperations" :key="operation?.id">
            <div class="title">
                <h3>{{operation?.name}}</h3>
            </div>
            <div class="content">
                <template v-if="operation?.id===taskLastEvent?.operation_id">
                    <TaskCard :task="task" />
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

