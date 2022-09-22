<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import TaskCard from "@/components/kanban/TaskCard.vue";
import { useTaskStore, type FilterPayload, type Task } from "@/stores/task";
import { useRouter } from "vue-router";
import DetailsWindow from "../../components/kanban/DetailsWindow.vue";
import { onBeforeMount, ref } from "vue";

const router = useRouter()
const taskStore = useTaskStore()
const taskId = router.currentRoute.value.params.id
const task = ref<Task>()
const fetchTaskById = (payload: FilterPayload) => { return taskStore.fetchTasksList(payload).then(res => {
            if (
                Object.prototype.hasOwnProperty.call(res, "message") &&
                res.message === "ok"
            ){
            const [data] = res.result
            task.value = data.queryResult
            return true;
            } else {
            return res.message || -1;
        }})
    }
        
onBeforeMount(async()=> {
    console.log('before mount hook')
    await fetchTaskById({filter: {id: Number(taskId)},options: {onlyLimit: true,itemsPerPage: 1},select: []})
})


</script>
<template>
    <div>HELLO</div>
    <!-- <div class="kanban-background">
        <div class="kanban-column" v-for="event in task?.event_entities" :key="event?.id">
            <div class="title">
                <h3>{{event?.id}}</h3>
            </div>
            <div class="content">

            </div>
        </div>
    </div> -->
</template>