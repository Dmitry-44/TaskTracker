<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import { useOperationStore } from "@/stores/operation";
import { useCommonStore } from "@/stores/common";
import { computed, onMounted, watch, type Ref, } from "vue";
import { ref } from "vue";
import OperationCollapseItem from "./OperationCollapseItem.vue";
import OperationLoader from "@/components/OperationLoader.vue";
import { usePipeStore } from "@/stores/pipe";
import { services } from "@/main";
import { taskStatusOptions, taskPriorityOptions, type Task, formatTask, taskDateFormat, type TaskEvent } from "@/entities/task"
import type { Operation } from "@/entities/operation";
import cloneDeep from 'lodash/cloneDeep';
import { lastFromArray } from "@/plugins/utils";
import DetailsWindowActions from "./DetailsWindowActions.vue";
import type { Event } from "@/entities/event";
import EventData from "./EventData.vue";


const props = defineProps({
  readonly: {
    type: Boolean,
    default: () => false,
  },
});

const CREATE_MODE = ref(false)
// const READ_MODE = computed(()=>props.readonly && task.value.id>0)
const READ_MODE = computed(()=>true)

const taskStore = useTaskStore();
const commonStore = useCommonStore();
const pipeStore = usePipeStore();
const userStore = useUserStore();
const operationStore = useOperationStore()
const user = userStore.getUser;
const TaskService = services.Task

//GETTERS
const detailWindowIsOpen = computed(() => commonStore.getDetailWindowIsOpen);
const activeTask = computed(() => taskStore.getActiveTask);
const task = ref(activeTask.value ?? cloneDeep(activeTask.value)) as Ref<TaskEvent|null>
// const taskLastEvent = computed(()=> lastFromArray(task.value.event_entities ?? []))
// const taskLastOperation = computed(()=>OPERATION_OPTIONS.value.find(oper=>oper.id===taskLastEvent.value?.operation_id))
const PIPES = computed(() => pipeStore.getPipes);
const DIVISIONS_OPTIONS = computed(()=>userStore.getDivisions)
const OPERATION_OPTIONS = computed(()=>operationStore.getOperations)

//VARIABLES
const LOADING = ref(false);
const initialData = ref(JSON.stringify(activeTask.value));
const dataWasChanged = computed(() => {
  const updatedData = JSON.parse(JSON.stringify(task.value));
  return initialData.value != JSON.stringify(updatedData);
});
const detailWindowTitleInput = ref<HTMLInputElement|null>(null);

// const taskPipe = computed(() => PIPES.value.find((pipe) => pipe?.id === task.value?.pipe_id));
// const taskDivision = computed(() => DIVISIONS_OPTIONS.value.find((division) => division?.id === task.value?.division_id));
const taskStatus = computed(() => taskStatusOptions.find((v) => v['id'] === task.value?.status));
const taskPriority = computed(() => taskPriorityOptions.find((v) => v['id'] === task.value?.priority));

//CONDITIONS
// const canChangeTaskText = computed(()=> TaskService.canChangeTaskText(task.value, user))
const canTakeTask = computed(()=> TaskService.canTakeTask(task.value!, user))
const canTakeTaskToProgress = computed(()=> TaskService.canTakeTaskToProgress(task.value!, user))
const canReturnTaskToBacklog = computed(()=> TaskService.canReturnTaskToBacklog(task.value!, user))
const canFinishTask = computed(()=> TaskService.canFinishTask(task.value!, user))
// const canChangeTaskTitle = computed(()=> TaskService.canChangeTaskTitle(task.value, user))
// const canChangeTaskPriority = computed(()=> TaskService.canChangeTaskPriority(task.value, user))
// const canChangeTaskDivision = computed(()=> TaskService.canChangeTaskDivision(task.value, user))
// const canSetTaskPipeline = computed(()=> TaskService.canSetTaskPipeline(task.value, user))
// const canChangeTaskPipeline = computed(()=> TaskService.canChangeTaskPipeline(task.value, user))


//METHODS
const finishTask = () => {
    taskStore.setTaskToFinish(cloneDeep(task.value))
    commonStore.openFinishTaskModal()
}
// const updatePipeData = (data: Event['params'], operId: Operation['id']) => {
//   task.value['pipe_data'][operId] = Object.assign(task.value['pipe_data'][operId], data)
// }
// const save = () => {
//   LOADING.value = true;
//   TaskService
//     .upsertTask(task.value)
//     .then(res => {
//       if (res) {
//         initialData.value=JSON.stringify(task.value)
//       }
//     })
//     .finally(() => {
//       LOADING.value = false;
//     });
// };

// onMounted(()=>{
//   initialData.value=JSON.stringify(task.value);
// })

watch(
  () => activeTask.value,
  (newVal, oldVal) => {
    if(newVal != oldVal){
      if(newVal){
        task.value = cloneDeep(newVal)
      }
      // initialData.value=JSON.stringify(newVal)
    }
  }
);

// watch(
//   () => task.value,
//   (newVal, oldVal) => {
//     formatTask(task.value)
//   },
//   {deep: true}
// );

// watch(
//   () => taskPipe.value,
//   (newTaskPipe, oldTaskPipe) => {
//     if(newTaskPipe != oldTaskPipe && task.value.id < 0){
//       task.value.pipe_data={}
//       newTaskPipe?.operation_entities.forEach(oper=>{
//         task.value.pipe_data[oper?.id]={}
//       })
//     }
//   }
// );

</script>

<template>
  <div :class="['details', detailWindowIsOpen ? 'active' : '']" @click.stop>
    <div class="header">
      <div class="actions">
        <DetailsWindowActions
          v-if="task"
          :task="task"
          :data-was-changed="dataWasChanged"
          :can-take-task="canTakeTask"
          :can-take-task-to-progress="canTakeTaskToProgress"
          :can-return-task-to-backlog="canReturnTaskToBacklog"
          :can-finish-task="canFinishTask"
          :CREATE_MODE="CREATE_MODE"
          :READ_MODE="READ_MODE"
          @finish="finishTask()"
        />
      </div>
    </div>
    <div v-if="task" class="body">
      <div class="title_block">
        <input
          v-model.trim="task.title"
          :disabled="READ_MODE"
          class="title-input"
          placeholder="Ввести название задачи"
          ref="detailWindowTitleInput"
        />
      </div>
      <div class="content">
        <div class="row" v-if="READ_MODE">
          <div class="left">Задача</div>
          <div class="right">
            <!-- <el-tag size="large" class="tag-info">{{ taskLastOperation?.name.toUpperCase() }}</el-tag> -->
          </div>
        </div>
        <div class="row">
          <div class="left">Приоритет</div>
          <div class="right">
            <el-tag v-if="READ_MODE && taskPriority" class="tag-info" size="large" :color="taskPriority?.['color']">{{ taskPriority!['value'] }}</el-tag>
          </div>
        </div>
        <div class="row">
          <div class="left">Подразделение</div>
          <div class="right">
            <!-- <el-tag size="large" class="tag-info">{{taskDivision?.name}}</el-tag> -->
          </div>
        </div>
        <div class="row">
          <div class="left">Пайплайн</div>
          <div class="right">
            <!-- <el-tag size="large" class="tag-info">{{taskPipe?.name}}</el-tag> -->
          </div>
        </div>
        <div class="row">
          <div class="left align-start">Текст</div>
          <div class="right text">
            <el-input
              v-model="task.text"
              :disabled="READ_MODE"
              clearable
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Текст задачи"
            />
          </div>
        </div>
        <OperationLoader 
          :key="task.id" 
          v-if="READ_MODE && task" 
          :id="task.operationId" 
          :params="task.params" 
          :readonly="readonly"
        />
        <EventData 
          v-if="task&&READ_MODE" 
          :key="`${task.id}-${task.id}`" 
          :event="task" 
        />

      </div>
    </div>
  </div>
</template>

<style lang="sass">
.details
    box-shadow: 0 0 0 1px #edeae9, 0 5px 20px 0 rgba(109, 110, 111, 0.08)
    background-color: #fff
    display: flex
    flex-direction: column
    right: 0
    position: fixed
    top: 60px
    bottom: 0
    z-index: 600
    overflow-y: scroll
    transition: all .8s cubic-bezier(0.23, 1, 0.32, 1)
    width: min(700px, 60%)
    transform: translateX(1000px)
    visibility: hidden
    &.active
        width: min(700px, 60%)
        transform: translateX(0px)
        visibility: visible

@media screen and (max-width: 768px)
  .details.active
    width: 100%
    
.details .header
    height: 50px
    padding: 0px 12px
    display: flex
    flex-shrink: 0
    .actions
        margin-left: auto
        display: flex
        align-items: center
.details .body
    display: flex
    flex-direction: column
    flex: 1 0 auto
    min-height: 1px
    z-index: 0
    background: #fff
    padding: 0 24px
    border-top: 1px solid #edeae9
.title_block input
    z-index: 0
    background-color: #fff
    border-width: 1px
    border-style: solid
    border-color: #fff
    border-radius: 6px
    box-sizing: border-box
    overflow-wrap: break-word
    padding: 6px 12px
    resize: none
    white-space: pre-wrap
    height: auto
    font-size: 20px
    letter-spacing: .8px
    font-weight: 500
    line-height: 32px
    min-height: 0
    width: 100%
    margin: 12px 0px
    margin-left: -12px
    &:hover
        border-color: #cfcbcb
    &:disabled:hover
      border-color: #fff

.header .title
    text-transform: uppercase
    text-indent: 10px
    margin: 10px 0px
    color: #303133
.body .content
    display: flex
    flex-direction: column
    gap: 14px
    .row
      display: flex
      align-items: baseline
      .align-start
        align-self: flex-start
    .left
        flex: 0 0 120px
        color: #6d6e6f
        font-size: 15px
        line-height: 18px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
    .right
        flex: 1 1 auto
        overflow-x: clip

.body .content .row .text textarea
    border-color: #fff
.el-select .el-input__wrapper
    box-shadow: none
    &:hover
        box-shadow:  0 0 0 1px #dcdfe6 inset

.el-select .el-input__wrapper
    box-shadow: none !important
.el-tag
    color: #000
    border: none

.el-collapse .row
    margin-bottom: .5rem
</style>
