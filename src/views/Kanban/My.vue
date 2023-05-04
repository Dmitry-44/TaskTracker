<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import type{ Task } from "@/entities/task";
import type { FilterPayload } from "@/api";
import DetailsWindow from "../../components/DetailsWindow.vue";
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import Filters from "../../components/Filters.vue";
import KanbanColumn from "@/components/KanbanColumn.vue";
import { services } from "@/main";
import { EventStatus } from "@/entities/event";



const taskStore = useTaskStore();
const $filters = ref<typeof Filters | null>(null);
const abortController = new AbortController();
const abortSignal = abortController.signal;
const TaskService = services.Task
const user = useUserStore().getUser;

//GETTERS
const LOADING = ref(false);
const readyTasks = computed(() => taskStore.getMyTasksByEventStatus(user, EventStatus.CREATED));
const tasksInProgress = computed(() => taskStore.getMyTasksByEventStatus(user, EventStatus.IN_PROGRESS));


//METHODS
const clickOutsideCards = () => {
  TaskService.clickOutsideTaskCard()
  $filters?.value?.["closeFilters"]();
};
const filterUpdate = async (payload: FilterPayload) => {
  LOADING.value = true;
  TaskService.clickOutsideTaskCard()
  await TaskService.fetchTasks(payload, abortSignal);
  LOADING.value = false;
};

//HOOKS
onBeforeUnmount(() => abortController.abort());


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
        <KanbanColumn
          :tasks-list="readyTasks"
          title="К исполнению"
          :add-New-Task="true"
          :no-actions="true"
          :loading="LOADING"
          key="1"
        />
        <KanbanColumn
          :tasks-list="tasksInProgress"
          title="В работе"
          :loading="LOADING"
          :no-actions="true"
          key="2"
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
    // outline: 2px solid #67C23A
    background-color: #6a7a97

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


</style>
