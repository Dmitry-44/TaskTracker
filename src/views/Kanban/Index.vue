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
const readyTasks = computed(() => taskStore.getTaskEventByStatus(user, EventStatus.CREATED));
const tasksInProgress = computed(() => taskStore.getTaskEventByStatus(user, EventStatus.IN_PROGRESS));
const taskFilters = computed(() => taskStore.getFilters)


const firstColumnData = computed(()=>{
  return {
    display: true,
    title: 'К исполнению',
    isDraggable: true,
    addNewTask: true,
    tasks: unref(readyTasks),
    loading: unref(LOADING),
    noActions: false
  }
})

const secondColumnData = computed(()=>{
  return {
    display: true,
    title: 'В работе',
    isDraggable: true,
    addNewTask: false,
    tasks: unref(tasksInProgress),
    loading: unref(LOADING),
    noActions: false
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
    key="index" 
    title="Назначены мне"
    :first-column="firstColumnData" 
    :second-column="secondColumnData" 
    :loading="LOADING" 
    :readonly="true" 
  />
</template>