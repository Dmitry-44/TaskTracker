<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import type { Task } from "@/types/task";
import type { FilterPayload } from "@/types/index";
import { useInterfaceStore } from "@/stores/interface";
import DetailsWindow from "../../components/DetailsWindow.vue";
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import Filters from "../../components/Filters.vue";
import KanbanColumn from "@/components/KanbanColumn.vue";
import { ElMessage } from "element-plus";
import { taskService } from "@/services/index";

const taskStore = useTaskStore();
const interfaceStore = useInterfaceStore();
const $filters = ref<typeof Filters | null>(null);
const abortController = new AbortController();
const abortSignal = abortController.signal;

//GETTERS
const tasks = computed(() => taskStore.getList);
const LOADING = ref(false);

const tasksToTake = computed(() =>
  tasks.value.filter((task) => task.status! <= 2)
);
const tasksInProcess = computed(() =>
  tasks.value.filter((task) => task.status === 3)
);
const tasksFinished = computed(() =>
  tasks.value.filter((task) => task.status === 4)
);

//ACTIONS
const setActiveTask = taskService.setActiveTask;
const toggleDetailsWindow = interfaceStore.toggleDetailsWindow;
const toggleCreatingTaskProcess = interfaceStore.toggleCreatingTaskProcess;


//METHODS
const clickOutsideCards = () => {
  $filters?.value?.["closeFilters"]();
  toggleDetailsWindow(false);
  setActiveTask(null);
  toggleCreatingTaskProcess(false);
};
const filterUpdate = async (payload: FilterPayload) => {
  LOADING.value = true;
  await taskService.fetchTasks(payload, abortSignal);
  LOADING.value = false;
};
const updateTask = async (task: Task) => {
  LOADING.value = true;
  const msg = ElMessage({
    message: "Сохраняю задачу..",
    type: "success",
    center: true,
    duration: 1000,
  });
  return taskService
    .upsertTask(task)
    .then(res => {
      if (res) {
        ElMessage({
          message: "Операция выполнена успешно!",
          type: "success",
          center: true,
          duration: 1500,
          showClose: true,
        });
        return true;
      } else {
        ElMessage({
          message: "Ошибка при выполнении операции!",
          type: "error",
          center: true,
          duration: 1500,
          showClose: true,
        });
        return false;
      }
    })
    .finally(() => {
      LOADING.value = false;
      msg.close();
    });
};

//HOOKS
onBeforeUnmount(() => abortController.abort());

//DRAG AND DROP
const transferTask = ref<Task | null>(null);
const taskInProcessArea = ref<any | HTMLDivElement>(null);
const tasksToTakeArea = ref<any | HTMLDivElement>(null);
const areaParams = new Map([
  [1, { areaRef: tasksToTakeArea, status: 2 }],
  [2, { areaRef: taskInProcessArea, status: 3 }],
]);
const stopAll = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const dragstartHandler = (ev: DragEvent, task: Task) => {
  transferTask.value = task;
  ev.dataTransfer!.effectAllowed = "link";
};
const dragoverHandler = (ev: DragEvent, areaId: number): void => {
  stopAll(ev);
  ev.dataTransfer!.effectAllowed = "link";
  const area = areaParams.get(areaId);
  if (!!transferTask.value && transferTask!.value?.status === area!.status)
    return;
  if (transferTask!.value?.status === 1 && area!.status === 2) return;
  area?.areaRef.value.classList.add("dragOver");
};
const dragleaveHandler = (ev: DragEvent) => {
  stopAll(ev);
  tasksToTakeArea.value.classList.remove("dragOver");
  taskInProcessArea.value.classList.remove("dragOver");
};
const dropHandler = async (ev: DragEvent, area: number) => {
  ev.dataTransfer!.dropEffect = "link";
  const updatedTask = tasks.value.find(
    (task) => task.id === transferTask?.value?.id
  );
  if (updatedTask) {
    if (updatedTask.status != areaParams.get(area)?.status) {
      updateTask({ ...updatedTask, status: areaParams.get(area)?.status }).then(
        (res) => {
          if (res) {
            updatedTask.status = areaParams.get(area)?.status;
          }
        }
      );
    }
  }
  tasksToTakeArea.value.classList.remove("dragOver");
  taskInProcessArea.value.classList.remove("dragOver");
};
</script>
<template>
  <div class="kanbar-wrapper">
    <div class="menu-top">
      <div class="filters-wrapper">
        <Filters @update="filterUpdate($event)" ref="$filters" />
      </div>
    </div>
    <div class="kanban-background" @click.stop="clickOutsideCards()">
      <DetailsWindow />
      <div
        class="draggable-area"
        @dragover="dragoverHandler($event, 1)"
        @dragleave="dragleaveHandler($event)"
        @drop="dropHandler($event, 1)"
        ref="tasksToTakeArea"
      >
        <KanbanColumn
          :tasks="tasksToTake"
          title="К исполнению"
          :add-New-Task="true"
          :is-Draggable="true"
          :loading="LOADING"
          key="1"
          @taskDragStart="dragstartHandler"
        />
      </div>
      <div
        class="draggable-area"
        @dragover="dragoverHandler($event, 2)"
        @dragleave="dragleaveHandler($event)"
        @drop="dropHandler($event, 2)"
        ref="taskInProcessArea"
      >
        <KanbanColumn
          :tasks="tasksInProcess"
          title="В работе"
          :is-Draggable="true"
          :loading="LOADING"
          key="2"
          @taskDragStart="dragstartHandler"
        />
      </div>
      <KanbanColumn
        :tasks="tasksFinished"
        title="Архив"
        :loading="LOADING"
        key="3"
      />
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
