<script lang="ts">
import { useUserStore } from "@/stores/user";
import type{ Task, TaskEvent } from "@/entities/task";
import DetailsWindow from "@/components/DetailsWindow.vue";
import DetailsWindow2 from "@/components/DetailsWindow2.vue";
import { computed, ref, watch, type PropType, type Ref } from "vue";
import Filters from "@/components/Filters.vue";
import KanbanColumn from "@/components/KanbanColumn.vue";
import { services } from "@/main";
import FinishTaskModal from "@/components/FinishTaskModal.vue";
import TakeTaskModal from "@/components/TakeTaskModal.vue";
import { EventStatus } from "@/entities/event";
import { useTaskStore } from "@/stores/task";

type ColumnProp = { 
  display: boolean,
  tasks: TaskEvent[],
  title?: string,
  addNewTask: boolean,
  isDraggable: boolean,
  noActions: boolean,
}

const columnPropDefault: ColumnProp = {
  display: true,
  tasks: [],
  title: '',
  addNewTask: false,
  isDraggable: true,
  noActions: false
}

export default {
  props: {
    firstColumn: {
      type: Object as PropType<ColumnProp>,
      required: true,
      default: columnPropDefault
    },
    secondColumn: {
      type: Object as PropType<ColumnProp>,
      required: true,
      default: columnPropDefault
    },
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const TaskService = services.Task
    const user = useUserStore().getUser;
    const filters = computed(()=>useTaskStore().getFilters)
    const filtersTags: Ref<Record<string,any>> = ref([])

    //METHODS
    const clickOutsideCards = () => {
      TaskService.clickOutsideTaskCard()
      services.Filters.closeFilters()
    };

    //DRAG AND DROP
    const areaCreated = ref<HTMLDivElement|null>(null);
    const areaInProgress = ref<HTMLDivElement|null>(null);
    const areaCompleted = ref<HTMLDivElement|null>(null);

    const stopAll = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const dragstartHandler = (event: DragEvent, task: TaskEvent) => {
      event.dataTransfer?.setData('text/plain', JSON.stringify(task));
      event.dataTransfer!.effectAllowed = "link";
    };
    const dragoverHandler = (event: DragEvent, areElement: HTMLElement): void => {
      stopAll(event);
      areElement.classList.add("dragOver")
    };
    const dragleaveHandler = (ev: DragEvent) => {
      stopAll(ev);
      clearDragAndDrop()
    };
    const dropHandler = async (event: DragEvent, newStatus: number) => {
      const task = JSON.parse(event.dataTransfer?.getData('text/plain')||'') as TaskEvent;
      if(!!task && typeof task === 'object') {
        TaskService.dragAndDropTask(task, newStatus, user)
        clearDragAndDrop()
      }
    };
    const clearDragAndDrop = () => {
      areaCreated.value?.classList.remove("dragOver");
      areaInProgress.value?.classList.remove("dragOver");
      areaCompleted.value?.classList.remove("dragOver");
    }

    watch(
      ()=> filters.value,
      ()=>{
        filtersTags.value=services.Filters.getFiltersNames()
      },
      {deep: true}
    )

    return {
      areaCreated,
      areaInProgress,
      areaCompleted,
      EventStatus,
      TaskService,
      clickOutsideCards,
      dragoverHandler,
      dragleaveHandler,
      dropHandler,
      dragstartHandler,
      filtersTags
    }
  },

}
</script>

<template>
  <div class="kanbar-wrapper">
    <div class="menu-top">

      <div class="filters-wrapper">
        <Filters />
        <el-tag class="tag-title tag-info" size="large" effect="dark" type="info">{{ title.toUpperCase() }}</el-tag>
        <el-tag :key="filter.id" v-for="filter in filtersTags" class="tag-info text-white ml-3" effect="dark" size="small" type="info" :color="filter?.['color']">{{ filter['value'] }}</el-tag>
      </div>
    </div>
    <div class="kanban-background" @click.stop="clickOutsideCards()">
      <DetailsWindow2 :readonly="readonly"/>
      <div
        class="draggable-area"
        @dragover="dragoverHandler($event, areaCreated!)"
        @dragleave="dragleaveHandler($event)"
        @drop="dropHandler($event, EventStatus.CREATED)"
        ref="areaCreated"
      >
        <KanbanColumn
          v-if="firstColumn.display"
          :tasks-list="firstColumn.tasks"
          :title="firstColumn.title"
          :add-New-Task="firstColumn.addNewTask"
          :is-Draggable="firstColumn.isDraggable"
          :loading="loading"
          :no-actions="firstColumn.noActions"
          key="1"
          @taskDragStart="dragstartHandler"
        />
      </div>
      <div
        class="draggable-area"
        @dragover="dragoverHandler($event, areaInProgress!)"
        @dragleave="dragleaveHandler($event)"
        @drop="dropHandler($event, EventStatus.IN_PROGRESS)"
        ref="areaInProgress"
      >
        <KanbanColumn
          v-if="secondColumn.display"
          :tasks-list="secondColumn.tasks"
          :title="secondColumn.title"
          :is-Draggable="secondColumn.isDraggable"
          :loading="loading"
          :no-actions="secondColumn.noActions"
          key="2"
          @taskDragStart="dragstartHandler"
        />
      </div>
    </div>
  </div>
  <FinishTaskModal />
  <TakeTaskModal />
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
    align-items: center

.draggable-area
    max-height: calc(100% - 10px)
    border-radius: 6px
    transition: all .2s
.draggable-area.dragOver
    // outline: 2px solid #67C23A
    background-color: #92a0ba

.draggable-area.dragOver .kanban-column:hover
  box-shadow: none

@media screen and (max-width: 1024px)
    .kanban-background
        width: fit-content

.indicator__wrapper
  display: flex
  align-items: center
  margin-right: 15px

.indicator 
  display: inline-block 
  width: 10px
  height: 10px
  border-radius: 50%
  background-color: #2ecc71
  box-shadow: 0px 0px 5px black

.tag-title 
  color: #fff

</style>
