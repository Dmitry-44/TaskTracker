<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import type { Task } from "@/entities/task";
import type { FilterPayload } from "@/api";
import DetailsWindow from "../../components/DetailsWindow.vue";
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import Filters from "../../components/Filters.vue";
import KanbanColumn from "@/components/KanbanColumn.vue";
import { services } from "@/main";


const taskStore = useTaskStore();
const $filters = ref<typeof Filters | null>(null);
const abortController = new AbortController();
const abortSignal = abortController.signal;
const TaskService = services.Task
const user = useUserStore().getUser;
const dialogFinishTaskIsOpen = ref(false)

//GETTERS
const tasks = computed(() => taskStore.getList);
const LOADING = ref(false);

const tasksToTake = computed(() =>
  tasks.value.filter((task) => task.event_entities![task.event_entities!.length-1]?.status === 1)
);
const tasksInProcess = computed(() =>
  tasks.value.filter((task) => task.event_entities![task.event_entities!.length-1]?.status === 2)
);
const tasksFinished = computed(() =>
  tasks.value.filter((task) => task.event_entities![task.event_entities!.length-1]?.status === 3)
);


//METHODS
const clickOutsideCards = () => {
  TaskService.clickOutsideTaskCard()
  $filters?.value?.["closeFilters"]();
};
const filterUpdate = async (payload: FilterPayload) => {
  LOADING.value = true;
  await TaskService.fetchTasks(payload, abortSignal);
  LOADING.value = false;
};
function dialogCancelHandle(){
  dialogFinishTaskIsOpen.value=false
}
function dialogOkHandle(){
  TaskService.dragAndDropTask(transferTask.value!, 3, user)
  dialogFinishTaskIsOpen.value=false
}

//HOOKS
onBeforeUnmount(() => abortController.abort());

//DRAG AND DROP
const transferTask = ref<Task | null>(null);
const taskInProcessArea = ref<HTMLDivElement|null>(null);
const tasksToTakeArea = ref<HTMLDivElement|null>(null);
const finishedTasksArea = ref<HTMLDivElement|null>(null);
const areaParams = new Map([
  [1, { areaRef: tasksToTakeArea, status: 1 }],
  [2, { areaRef: taskInProcessArea, status: 2 }],
  [3, { areaRef: finishedTasksArea, status: 3 }],
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
  const taskLastevent = transferTask.value?.event_entities![transferTask.value?.event_entities!.length-1];
  const area = areaParams.get(areaId);
  if (taskLastevent && taskLastevent.status === area!.status)return;
  area?.areaRef.value?.classList.add("dragOver");
};
const dragleaveHandler = (ev: DragEvent) => {
  stopAll(ev);
  clearDragAndDrop()
};
const dropHandler = async (ev: DragEvent, area: number) => {
  if(area===3){
    dialogFinishTaskIsOpen.value=true
    clearDragAndDrop()
    return;
  }
  TaskService.dragAndDropTask(transferTask.value!, area, user)
  clearDragAndDrop()
};
const clearDragAndDrop = () => {
  tasksToTakeArea.value?.classList.remove("dragOver");
  taskInProcessArea.value?.classList.remove("dragOver");
  finishedTasksArea.value?.classList.remove("dragOver");
}
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
      <div
        class="draggable-area"
        @dragover="dragoverHandler($event, 3)"
        @dragleave="dragleaveHandler($event)"
        @drop="dropHandler($event, 3)"
        key="3"
        ref="finishedTasksArea"
      >
        <KanbanColumn
          :tasks="tasksFinished"
          title="Завершенные"
          :loading="LOADING"
          key="3"
        />
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogFinishTaskIsOpen"
    width="30%"
    @close="dialogCancelHandle"
  >
    <el-row justify="center">
      Уверены что хотите завершить задачу?</el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button
        @click="dialogCancelHandle"
        >Отмена
      </el-button>
        <el-button
        type="primary"
        @click="dialogOkHandle"
        >
        Ок</el-button>
      </span>
    </template>
  </el-dialog>
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
