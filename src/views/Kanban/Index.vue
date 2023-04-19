<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import { useCommonStore } from "@/stores/common";
import type{ Task } from "@/entities/task";
import type { FilterPayload } from "@/api";
import DetailsWindow from "../../components/DetailsWindow.vue";
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import Filters from "../../components/Filters.vue";
import KanbanColumn from "@/components/KanbanColumn.vue";
import { services } from "@/main";
import FinishTaskModal from "@/components/FinishTaskModal.vue";
import { EventStatus } from "@/entities/event";


const taskStore = useTaskStore();
const commonStore = useCommonStore();
const $filters = ref<typeof Filters | null>(null);
const abortController = new AbortController();
const abortSignal = abortController.signal;
const TaskService = services.Task
const user = useUserStore().getUser;

//GETTERS
const tasks = computed(() => taskStore.getList);
const LOADING = ref(false);

const tasksToTake = computed(() =>
  tasks.value.filter((task) => task.value.event_entities![task.value.event_entities!.length-1]?.status === 1)
);
const tasksInProcess = computed(() =>
  tasks.value.filter((task) => task.value.event_entities![task.value.event_entities!.length-1]?.status === 2)
);
const tasksFinished = computed(() =>
  tasks.value.filter((task) => task.value.event_entities![task.value.event_entities!.length-1]?.status === 3)
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

//HOOKS
onBeforeUnmount(() => abortController.abort());

//DRAG AND DROP
const transferTask = ref<Task | null>(null);
const areaCreated = ref<HTMLDivElement|null>(null);
const areaInProgress = ref<HTMLDivElement|null>(null);
const areaCompleted = ref<HTMLDivElement|null>(null);
const areaParams = new Map([
  [1, { areaRef: areaCreated, status: 1 }],
  [2, { areaRef: areaInProgress, status: 2 }],
  [3, { areaRef: areaCompleted, status: 3 }],
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
const dropHandler = async (newStatus: number) => {
  TaskService.dragAndDropTask(transferTask.value!, newStatus, user)
  clearDragAndDrop()
};
const clearDragAndDrop = () => {
  // transferTask.value=null;
  areaCreated.value?.classList.remove("dragOver");
  areaInProgress.value?.classList.remove("dragOver");
  areaCompleted.value?.classList.remove("dragOver");
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
        @drop="dropHandler(EventStatus.CREATED)"
        ref="areaCreated"
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
        @drop="dropHandler(EventStatus.IN_PROGRESS)"
        ref="areaInProgress"
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
        @drop="dropHandler(EventStatus.COMPLETED)"
        ref="areaCompleted"
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
  <FinishTaskModal />
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
