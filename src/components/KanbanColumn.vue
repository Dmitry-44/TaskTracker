<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import { useTaskStore } from "@/stores/task";
import type { Task } from "@/types/task";
import { toRef, type PropType, watch } from "vue";
import { ref, computed } from "vue";
import { Plus, Top, Bottom, CloseBold } from "@element-plus/icons-vue";
import KanbanColumnFilter from "./KanbanColumnSortPicker.vue";
import { services } from "@/main";


const props = defineProps({
  tasks: {
    type: Object as PropType<Task[]>,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  addNewTask: {
    type: Boolean,
    default: false,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "taskDragStart", ev: DragEvent, task: Task): void;
}>();

const taskStore = useTaskStore();
const TaskService = services.Task

//GETTERS
const activeTask = computed(() => taskStore.getActiveTask);

const LOADING = toRef(props, "loading");
const searchValue = ref("");

const tasks = ref<Task[]>([]);

watch(
  () => props.tasks,
  (newVal) => {
    tasks.value = JSON.parse(JSON.stringify(newVal));
  },
  { deep: true }
);

//METHODS

const doSearch = () => {
  tasks.value = TaskService.searchTasks(props.tasks, searchValue.value)
};
const setDefaultSort = () => {
  tasks.value = JSON.parse(JSON.stringify(props.tasks));
};

</script>

<template>
  <div class="kanban-column">
    <div class="title-row">
      <h3>{{ title }}</h3>
      <template v-if="addNewTask">
        <el-tooltip
          class="item"
          effect="dark"
          content="Добавить задачу"
          placement="top-start"
        >
          <el-button size="small" :icon="Plus" @click.stop="TaskService.createNewTask()" />
        </el-tooltip>
      </template>
    </div>
    <div class="title-row">
      <el-input
        v-model="searchValue"
        class="input-search"
        clearable
        @input="doSearch"
        size="small"
        placeholder="Поиск"
      />
      <KanbanColumnFilter
        @changeSort="(sort) => tasks.sort(sort)"
        @noSort="setDefaultSort"
      />
    </div>
    <div class="content">
      <el-skeleton
        style="width: 300px"
        :loading="LOADING"
        animated
        :throttle="500"
      >
        <template #template>
          <el-skeleton-item
            variant="rect"
            style="width: 300px; height: calc(100vh - 230px)"
          />
        </template>
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :draggable="isDraggable"
          :task="task"
          :active="task.id === activeTask?.id ? true : false"
          @click.stop="TaskService.clickTask(task)"
          @dragstart="emit('taskDragStart', $event, task)"
        />
        <el-button
          v-if="addNewTask"
          @click.stop="TaskService.createNewTask()"
          class="column-button-footer"
          :icon="Plus"
        >
          Добавить задачу
        </el-button>
      </el-skeleton>
    </div>
  </div>
</template>

<style lang="sass">
.kanban-column
    display: flex
    flex-direction: column
    border-radius: 6px
    position: relative
    flex: 0 0 304px
    width: 310px
    margin: 0 5px
    height: 100%
    max-width: 304px
    padding: 0 12px
    border: 2px solid #f9f8f8
    transition: box-shadow, border-color 250ms
    &:hover
        box-shadow: 0 0 0 1px #edeae9
    .title-row
        align-items: center
        display: flex
        justify-content: space-between
        position: relative
        h3
            font-size: 16px
            line-height: 20px
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            margin-right: auto
            display: inline-block
            position: relative
            flex-shrink: 0
            margin-right: 5px
            margin-block: 8px
    > .content
        max-height: 100%
        overflow-y: auto
        overflow-x: hidden
        padding: 0px 4px
        margin-top: 20px

.kanban-column .column-button-footer
    background-color: inherit
    margin: 0 auto
    display: flex
    border: none

.input-search
    width: 65%
    margin-right: 8px
</style>
