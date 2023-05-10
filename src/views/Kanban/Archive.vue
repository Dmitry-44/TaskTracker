<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import type { FilterPayload } from "@/api";
import { ref, computed, onBeforeUnmount, nextTick, watch, unref } from "vue";
import { services } from "@/main";
import { EventStatus } from "@/entities/event";
import Kanban from "@/components/Kanban.vue";


const taskStore = useTaskStore();
const abortController = new AbortController();
const abortSignal = abortController.signal;
const TaskService = services.Task
const user = useUserStore().getUser;

//GETTERS
const LOADING = ref(false);
const taskFilters = computed(() => taskStore.getfilters)

const tasksIFinished = computed(() => taskStore.getMyTasksByEventStatus(user, EventStatus.COMPLETED));

const firstColumnData = computed(()=>{
  return {
    display: true,
    title: 'Завершенные',
    isDraggable: false,
    addNewTask: false,
    tasks: unref(tasksIFinished),
    loading: unref(LOADING),
    noActions: true
  }
})

const secondColumnData = {
    display: false,
    title: 'В работе',
    isDraggable: false,
    addNewTask: false,
    tasks: [],
    loading: false,
    noActions: true
}

const filterUpdate = async (payload: FilterPayload) => {
  LOADING.value = true;
  TaskService.clickOutsideTaskCard()
  await TaskService.fetchTasks(payload, abortSignal);
  LOADING.value = false;
};

watch(
  ()=>taskFilters.value,
  (newValue)=>filterUpdate(newValue),
  {deep: true}
)

//HOOKS
onBeforeUnmount(() => {
  if(LOADING){
    abortController.abort()
  }
});
</script>

<template>
  <Kanban 
    key="my" 
    :first-column="firstColumnData" 
    :second-column="secondColumnData" 
    :loading="LOADING" 
    :readonly="true"  
  />
</template>