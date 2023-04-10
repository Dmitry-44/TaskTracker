<script setup lang="ts">
import { SuccessFilled, More, EditPen, Pointer, Finished, ArrowLeftBold, ArrowRightBold} from "@element-plus/icons-vue";
import { ref, onMounted, computed, nextTick, watch, onUpdated, onBeforeMount } from "vue";
import type { PropType } from "vue";
import SelectOptions from "./SelectOptions.vue";
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import type { Task } from "@/types/task";
import { services } from "@/main";

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
});

const taskStore = useTaskStore();
const task = ref(props.task);
const readonlyTask = computed(() => task.value.status === 4);
const priorityOptions = taskStore.getPriorityOptions;
const statusOptions = taskStore.getStatusOptions;
const eventStatusOptions = taskStore.getEventStatusOptions;
const user = useUserStore().getUser;
const activeTask = computed(()=>taskStore.getActiveTask)

const selectMore = ref<any | HTMLInputElement>(null);
const TaskService = services.Task

const taskPriority = computed(
  () => priorityOptions.filter((v) => v.id === task.value.priority)[0]
);
const taskStatus = computed(
  () => eventStatusOptions.find((v) => v.id === task.value.event_entities![task.value.event_entities!.length - 1].status)
);

const taskCardElement = ref<any | HTMLInputElement>(null);

watch(
  () => task.value,
  (newVal) => {
    console.log('newVal', newVal)
    if(activeTask.value.id===newVal.id){
      return;
    }
    taskCardElement.value?.classList.add('card-update-anim')
    // setTimeout(()=>{
    //   taskCardElement.value?.classList.remove('card-update-anim')
    // },1000)
  },
  {
    deep: true,
  }
);

onMounted(()=>{
  taskCardElement.value?.classList.add('card-update-anim')
})

</script>

<template>
  <div :class="['card', active ? 'active' : '', readonlyTask ? 'done' : '']" ref='taskCardElement'>
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
            :content="`Приоритет: ${taskPriority.value}`"
            placement="top-start"
          >
            <el-tag :color="taskPriority.color">{{
              taskPriority.value
            }}</el-tag>
          </el-tooltip>
        </div>
        <div class="wrapper" v-if="taskStatus">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`Статус: ${taskStatus.value}`"
            placement="top-start"
          >
            <el-tag :color="taskStatus.color">{{ taskStatus.value }}</el-tag>
          </el-tooltip>
        </div>
      </div>
      <div class="actions">
        <div class="buttons">
          <el-tooltip
            v-if="TaskService.canTakeTask(task, user!)"
            class="item"
            effect="dark"
            content="Взять задачу"
            placement="top-start"
          >
            <el-button
              :icon="Pointer"
              @click.stop="TaskService.takeTask(task, user!)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="TaskService.canTakeTaskToProgress(task, user!)"
            class="item"
            effect="dark"
            content="В работу"
            placement="top-start"
          >
            <el-button
              :icon="ArrowRightBold"
              @click.stop="TaskService.takeTaskToProgress(task,user!)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="TaskService.canReturnTaskToBacklog(task, user!)"
            class="item"
            effect="dark"
            content="Вернуть к исполнению"
            placement="top-start"
          >
            <el-button
              :icon="ArrowLeftBold"
              @click.stop="TaskService.returnTaskToBacklog(task,user!)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="TaskService.canFinishTask(task, user!)"
            class="item"
            effect="dark"
            content="Завершить задачу"
            placement="top-start"
          >
            <el-button
              :icon="Finished"
              @click.stop="TaskService.finishTask(task,user!)"
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
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4)
    // transform: translateX(0)

  25% 
    box-shadow: 0 0 0 5px rgba(0, 255, 0, 0.2)
    // transform: translateX(-3px)


  50%
    box-shadow: 0 0 0 5px rgba(0, 255, 0, 0)
    transform: scale(1.01)
    // transform: translateX(0)

  51%
    // box-shadow: 0 0 0 10px rgba(0, 255, 0, 0.4)

  75%
    // box-shadow: 0 0 0 10px rgba(0, 255, 0, 0.2)
    // transform: translateX(3px)

  
  100% 
    // box-shadow: 0 0 0 10px rgba(0, 255, 0, 0)
    transform: scale(1)
    // transform: translateX(0)

    
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