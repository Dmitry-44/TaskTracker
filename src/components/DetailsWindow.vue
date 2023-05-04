<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useUserStore } from "@/stores/user";
import { useOperationStore } from "@/stores/operation";
import { useCommonStore } from "@/stores/common";
import { Close, Pointer, Notification, Finished, ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue";
import { computed, defineAsyncComponent, onMounted, reactive, toRaw, toRef, watch, type Component, type Ref, type VueElementConstructor } from "vue";
import { ref } from "vue";
import OperationCollapseItem from "./OperationCollapseItem.vue";
import { usePipeStore } from "@/stores/pipe";
import { services } from "@/main";
import { taskStatusOptions, taskPriorityOptions, type Task, formatTask } from "@/entities/task"
import type { Operation } from "@/entities/operation";
import cloneDeep from 'lodash/cloneDeep';
import { lastFromArray, operationResolver } from "@/plugins/utils";
import operationComponents from '../../operationComponents.json';


const props = defineProps({
  readonly: {
    type: Boolean,
    default: () => false,
  },
});

const CREATE_MODE = computed(()=>task.value.id<=0)
const READ_MODE = computed(()=>props.readonly)

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
let task = ref(cloneDeep(activeTask.value)) as Ref<Task>
const taskLastEvent = computed(()=> lastFromArray(task.value.event_entities!))
const taskLastOperation = computed(()=>OPERATION_OPTIONS.value.find(oper=>oper.id===taskLastEvent.value?.operation_id))
const canChangeEventParams = computed(()=>TaskService.canChangeEventParams(task.value, user))
// let task = ref(structuredClone(activeTask.value)) as Ref<Task>
// const isCreatingTaskProcess = computed(
//   () => commonStore.isCreatingTaskProcess
// );
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

const taskPipe = computed(
  () => PIPES.value.find((pipe) => pipe?.id === task.value?.pipe_id)
);
const taskDivision = computed(
  () => DIVISIONS_OPTIONS.value.find((division) => division?.id === task.value?.division_id)
);
const taskStatus = computed(
  () => taskStatusOptions.find((v) => v['id'] === task.value.status)
);
const taskPriority = computed(
  () => taskPriorityOptions.find((v) => v['id'] === task.value.priority)
);
const canChangeEventExecutors = computed(()=> TaskService.canChangeEventExecutors(task.value, user))
const canChangeTaskText = computed(()=> TaskService.canChangeTaskText(task.value, user))
const canTakeTask = computed(()=> {
  console.log('can take task computed')
  return TaskService.canTakeTask(task.value, user)})
const canTakeTaskToProgress = computed(()=> TaskService.canTakeTaskToProgress(task.value, user))
const canReturnTaskToBacklog = computed(()=> TaskService.canReturnTaskToBacklog(task.value, user))
const canFinishTask = computed(()=> TaskService.canFinishTask(task.value, user))
const canChangeTaskTitle = computed(()=> TaskService.canChangeTaskTitle(task.value, user))
const canChangeTaskPriority = computed(()=> TaskService.canChangeTaskPriority(task.value, user))
const canChangeTaskDivision = computed(()=> TaskService.canChangeTaskDivision(task.value, user))
const canSetTaskPipeline = computed(()=> TaskService.canSetTaskPipeline(task.value, user))
const canChangeTaskPipeline = computed(()=> TaskService.canChangeTaskPipeline(task.value, user))

//METHODS
const finishTask = () => {
    taskStore.setTaskToFinish(cloneDeep(task.value))
    commonStore.openFinishTaskModal()
}
const updatePipeData = (data: Task['pipe_data'], operId: Operation['id']) => {
  task.value['pipe_data'][operId] = data
}

onMounted(()=>{
  initialData.value=JSON.stringify(task.value);
})

watch(
  () => activeTask.value,
  (newVal, oldVal) => {
    if(newVal != oldVal){
      task.value = cloneDeep(newVal)
      initialData.value=JSON.stringify(newVal)
    }
  }
);

watch(
  () => task.value,
  (newVal, oldVal) => {
    formatTask(task.value)
  },
  {deep: true}
);

const OperationComponentsList: Record<string, Component> = {}
const componentList: Record<string, string> = operationComponents

watch(
  () => taskPipe.value,
  (newTaskPipe, oldTaskPipe) => {
    newTaskPipe?.operation_entities.forEach(async (oper)=>{
      OperationComponentsList[oper.id]= defineAsyncComponent({
        loader: () => import(/* @vite-ignore */`../components/operations/${componentList[oper.id]}`),
      });
    })
    if(newTaskPipe != oldTaskPipe && task.value.id < 0){
      task.value.pipe_data={}
      newTaskPipe?.operation_entities.forEach(oper=>{
        task.value.pipe_data[oper?.id]={}
      })
    }
  }
);

//METHODS
const save = () => {
  if(!task.value)return
  LOADING.value = true;
  TaskService
    .upsertTask(task.value)
    .then(res => {
      if (res) {
        initialData.value=JSON.stringify(task.value)
      }
    })
    .finally(() => {
      LOADING.value = false;
    });
};

</script>

<template>
  <div :class="['details', detailWindowIsOpen ? 'active' : '']" @click.stop>
    <div class="header">
      <div class="actions">
        <el-button
          v-if="!READ_MODE"
          :loading="LOADING"
          :disabled="!dataWasChanged"
          type="success"
          @click="save()"
          >Сохранить</el-button
        >
        <el-button
          :loading="LOADING"
          v-show="CREATE_MODE"
          type="info"
          @click="TaskService.clearTask()"
          >Очистить</el-button
        >
        <template v-if="READ_MODE">
          <el-tooltip
            v-if="canTakeTask"
            class="item"
            effect="dark"
            content="Взять задачу"
            placement="top-start"
          >
            <el-button 
            :icon="Pointer"
            @click.stop="TaskService.takeTask(task, user)"
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
              @click.stop="TaskService.takeTaskToProgress(task, user)"
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
              @click.stop="TaskService.returnTaskToBacklog(task, user)"
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
            >
            </el-button>
          </el-tooltip>
        </template>
        <el-tooltip
          class="item"
          effect="dark"
          content="Закрыть"
          placement="top-start"
        >
          <el-button
            class="close-btn"
            :icon="Close"
            @click.stop="TaskService.closeDetailWindow()"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="body">
      <div class="title_block">
        <input
          v-model.trim="task.title"
          :disabled="!canChangeTaskTitle || READ_MODE"
          class="title-input"
          placeholder="Ввести название задачи"
          ref="detailWindowTitleInput"
        />
      </div>
      <div class="content">
        <div class="row" v-if="READ_MODE">
          <div class="left">Задача</div>
          <div class="right">
            <el-tag size="large" class="tag-info">{{ taskLastOperation?.name.toUpperCase() }}</el-tag>
          </div>
        </div>
        <div class="row" v-if="READ_MODE && taskStatus">
          <div class="left">Статус</div>
          <div class="right">
            <el-tag size="large" class="tag-info" :color="taskStatus['color']">{{ taskStatus['value'] }}</el-tag>
          </div>
        </div>
        <div class="row">
          <div class="left">Приоритет</div>
          <div class="right">
            <el-select
              v-model="task.priority"
              v-if="canChangeTaskPriority && !READ_MODE"
              placeholder="Приоритет"
            >
              <el-option
                v-for="item in taskPriorityOptions"
                :key="item['value']"
                :label="item['value']"
                :value="item['id']"
              >
                <el-tag class="tag-info" :color="item['color']">{{ item['value'] }}</el-tag>
              </el-option>
            </el-select>
            <el-tag v-if="READ_MODE && taskPriority" class="tag-info" size="large" :color="taskPriority?.['color']">{{ taskPriority!['value'] }}</el-tag>
          </div>
        </div>
        <div class="row">
          <div class="left">Подразделение</div>
          <div class="right">
            <el-select
              v-if="CREATE_MODE && canChangeTaskDivision"
              v-model="task.division_id"
              clearable
              placeholder="Назначить подразделение"
            >
              <el-option
                v-for="item in DIVISIONS_OPTIONS"
                :key="item?.['id']"
                :label="item?.['name']"
                :value="item?.['id']"
              >
              </el-option>
            </el-select>
            <el-tag v-else size="large" class="tag-info">{{taskDivision?.name}}</el-tag>
          </div>
        </div>
        <div class="row" v-if="canSetTaskPipeline">
          <div class="left">Пайплайн</div>
          <div class="right">
            <el-select
              v-if="CREATE_MODE && canChangeTaskPipeline"
              v-model="task.pipe_id"
              clearable
              placeholder="Пайплайн"
            >
              <el-option
                v-for="item in PIPES"
                :key="item?.id"
                :label="item?.name"
                :value="item?.id"
              >
              </el-option>
            </el-select>
            <el-tag size="large" class="tag-info" v-else>{{taskPipe?.name}}</el-tag>
          </div>
        </div>
        <div class="row">
          <div class="left align-start">Текст</div>
          <div class="right text">
            <el-input
              v-model="task.text"
              :disabled="!canChangeTaskText || READ_MODE"
              clearable
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Текст задачи"
            />
          </div>
        </div>
        <component v-if="READ_MODE && taskLastOperation" :readonly="readonly" :is="OperationComponentsList[taskLastOperation['id']]"></component>
        <div v-if="task.pipe_id && !READ_MODE">
          <span class="left">Операции</span>
          <el-collapse class="mt-2">
            <template
              v-for="operation in taskPipe?.operation_entities"
              :key="`${task.id}-${operation?.id}`"
            >
            <el-collapse-item class="collapse-item">
              <template #title>
                <div class="collapse-item-header">
                  <!-- <el-icon :color="eventStatus?.['color']">
                    <SuccessFilled />
                  </el-icon> -->
                  <span class="ml-1 operation-item-name">{{ operation.name.toUpperCase() }}</span>
                </div>
              </template>
              <component :is="OperationComponentsList[operation.id]"></component>
            </el-collapse-item>
              <!-- <OperationCollapseItem
                :operation="operation"
                :event="task?.event_entities!.find(event=>event?.operation_id===operation?.id) || null"
                :task-id="task.id"
                :pipe-data="task.pipe_data[operation.id]"
                :can-select-executors="canChangeEventExecutors"
                :can-change-event-params="canChangeEventParams"
                :active-division-id="task.division_id"
                @update="updatePipeData($event, operation.id)"
              /> -->
            </template>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
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
