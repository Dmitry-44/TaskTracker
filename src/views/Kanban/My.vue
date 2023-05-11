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
const readyTasks = computed(() => taskStore.getMyTasksByEventStatus(user, EventStatus.CREATED));
const tasksInProgress = computed(() => taskStore.getMyTasksByEventStatus(user, EventStatus.IN_PROGRESS));
const taskFilters = computed(() => taskStore.getFilters)


const firstColumnData = computed(()=>{
  return {
    display: true,
    title: 'К исполнению',
    isDraggable: false,
    addNewTask: true,
    tasks: unref(readyTasks),
    loading: unref(LOADING),
    noActions: true
  }
})

const secondColumnData = computed(()=>{
  return {
    display: true,
    title: 'В работе',
    isDraggable: false,
    addNewTask: false,
    tasks: unref(tasksInProgress),
    loading: unref(LOADING),
    noActions: true
  }
})

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
    title="Созданы мной"
    :first-column="firstColumnData" 
    :second-column="secondColumnData" 
    :loading="LOADING" 
    :readonly="false"  
  />
</template>