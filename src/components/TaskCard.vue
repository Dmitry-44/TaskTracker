<script setup lang="ts">
import { SuccessFilled, More, EditPen, Pointer, Finished, ArrowLeftBold, ArrowRightBold} from "@element-plus/icons-vue";
import { ref, onMounted, computed, watch } from "vue";
import type { PropType } from "vue";
import SelectOptions from "./SelectOptions.vue";
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import { useCommonStore } from "@/stores/common";
import { taskPriorityOptions, taskStatusOptions, type Task } from "@/entities/task";
import { services } from "@/main";
import { updatedTasksIds } from "@/services/taskStoreUpdater";


const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    default: () => ({}),
    require: true,
  },
  active: {
    type: Boolean,
    default: () => false,
  },
  emptyCard: {
    type: Boolean,
    default: () => false,
  },
  noActions: {
    type: Boolean,
    default: () => false,
  },
});

const taskStore = useTaskStore();
const readonlyTask = computed(() => props.task.status === 4);
const userStore = useUserStore();
const commonStore = useCommonStore();
const user = userStore.getUser;
const TaskService = services.Task
// const DIVISIONS_OPTIONS = computed(()=>userStore.getDivisions)

const selectMore = ref<any | HTMLInputElement>(null);
const taskCardElement = ref<any | HTMLInputElement>(null);

const taskPriority = computed(
  () => taskPriorityOptions.find((v) => v['id'] === props.task.priority)
);
const taskStatus = computed(
  () => taskStatusOptions.find((v) => v['id'] === props.task.status)
);
// const taskDivision = computed(
//   () => DIVISIONS_OPTIONS.value.find((division) => division?.id === task.value?.division_id)
// );


//CONDITIONS
const canTakeTask = computed(()=>TaskService.canTakeTask(props.task, user))
const canTakeTaskToProgress = computed(()=>TaskService.canTakeTaskToProgress(props.task, user))
const canReturnTaskToBacklog = computed(()=>TaskService.canReturnTaskToBacklog(props.task, user))
const canFinishTask = computed(()=>TaskService.canFinishTask(props.task, user))


//METHODS
const finishTask = () => {
    taskStore.setTaskToFinish(Object.assign({}, props.task))
    commonStore.openFinishTaskModal()
}
const takeTask = () => {
    taskStore.setTaskToTake(Object.assign({}, props.task))
    commonStore.openTakeTaskModal()
}
const setAnimation = () => {
  const ANIMATION_LIFETIME = 3000
  taskCardElement.value?.classList.add('card-update-anim')
  setTimeout(()=>{
    taskCardElement.value?.classList.remove('card-update-anim')
  },ANIMATION_LIFETIME)
}

watch(
  () => props.task,
  (newVal, oldVal) => {
    if( updatedTasksIds.has(newVal.id) ) {
      setAnimation()
    }
  },
  {
    deep: true,
  }
);

onMounted(()=>{
  if( updatedTasksIds.has(props.task.id) ) {
      setAnimation()
    }
})

</script>

<template>
  <div :class="['card', active ? 'active' : '', readonlyTask ? 'done' : '']" :style="{ '--priority-color': taskPriority!['color'] }" ref='taskCardElement'>
    <div class="content">
      <div class="title-indicator">
        <span class="title">
          {{ task.title }}
        </span>
      </div>
      <div class="tags">
        <div class="wrapper" v-if="task.priority">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`Приоритет: ${taskPriority!['value']}`"
            placement="top-start"
          >
            <el-tag :color="taskPriority!['color']">{{
              taskPriority!['value']
            }}</el-tag>
          </el-tooltip>
        </div>
        <div class="wrapper" v-if="taskStatus">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`Статус: ${taskStatus['value']}`"
            placement="top-start"
          >
            <el-tag :color="taskStatus['color']">{{ taskStatus['value'] }}</el-tag>
          </el-tooltip>
        </div>
      </div>
      <div class="actions">
        <div v-if="!noActions" class="buttons">
          <el-tooltip
            v-if="canTakeTask"
            class="item"
            effect="dark"
            content="Взять задачу"
            placement="top-start"
          >
            <el-button
              :icon="Pointer"
              @click.stop="takeTask()"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="canTakeTaskToProgress"
            class="item"
            effect="dark"
            content="В работу"
            placement="top-start"
          >
            <el-button
              :icon="ArrowRightBold"
              @click.stop="TaskService.takeTaskToProgress(task,user)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="canReturnTaskToBacklog"
            class="item"
            effect="dark"
            content="Вернуть к исполнению"
            placement="top-start"
          >
            <el-button
              :icon="ArrowLeftBold"
              @click.stop="TaskService.returnTaskToBacklog(task,user)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="canFinishTask"
            class="item"
            effect="dark"
            content="Завершить задачу"
            placement="top-start"
          >
            <el-button
              :icon="Finished"
              @click.stop="finishTask()"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="menu">
      <el-button
        type="info"
        plain
        :icon="More"
        @click.stop="selectMore.toggleMenu()"
      ></el-button>
      <el-select class="select-more" ref="selectMore">
        <SelectOptions :task="task" />
      </el-select>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.card
    border: 1px solid #edeae9
    border-radius: 8px
    height: 150px
    width: 100%
    background-color: #fff
    overflow: hidden
    position: relative
    overflow: hidden
    // width: 280px
    cursor: pointer
    margin-bottom: 8px
    transition-duration: 200ms
    transition-property: background,border-color,box-shadow
    box-shadow: inset 0px 2px 15px -8px var(--priority-color)

    &:hover
        border-color: #afabac
    &.done .content
        opacity: .4
    &.active
        background: #f1f2fc
        border-color: #406ac4
    & .title-indicator
        line-height: 22px
        max-height: 120px
        margin: 12px 55px 12px 16px
        min-height: 20px
        overflow-x: hidden
        overflow-y: auto
        position: relative
        & .title
            // text-indent: 24px
            display: block
            overflow-wrap: break-word
            font-size: 14px
        & .indicator
            align-items: center
            display: flex
            flex-direction: row
            height: 20px
            left: 0
            overflow: hidden
            position: absolute
            top: 0
            cursor: pointer
            &:hover
                opacity: .7
.card.card-update-anim
  animation: card-pulse 1s ease-in-out
  animation-iteration-count: 3


@keyframes card-pulse 
  0% 
    transform: scale(1)
    outline: 0 0 0 0 rgba(0, 255, 0, 0.4)
    outline: 0px ridge rgba(0, 255, 0, 0.4)
  25% 
    outline: 5px ridge rgba(0, 255, 0, 0.4)
  50%
    outline: 0px ridge rgba(0, 255, 0, 0.4)
    transform: scale(1.005)
  100% 
    transform: scale(1)

.card .menu
    margin: 8px
    position: absolute
    right: 0
    top: 0
    display: initial
    display: none

.select-more
    appearance: none
    position: absolute
    width: 1px
    height: 1px
    visibility: hidden

.card .content
    height: 100%
    display: flex
    flex-direction: column
    justify-content: space-between

.card .tags
    margin: 0 16px
    display: flex
    flex-flow: wrap
    margin-bottom: -8px
    .wrapper
        margin-bottom: 8px
        margin-right: 8px
        max-width: 100%
.el-tag
    color: #000
    border: none
.card .actions
    align-items: center
    display: flex
    flex-direction: row
    margin: 12px 8px 8px 16px
    .buttons
        align-items: center
        display: flex
        flex: 1
        flex-direction: row
        flex-shrink: 1
        justify-content: flex-end
</style>
