<script setup lang="ts">
import { eventStatusOptions, type Event } from "@/entities/event";
import type { Operation } from "@/entities/operation";
import { emptyTask, taskDateFormat, type Task } from "@/entities/task";
import { useOperationStore } from "@/stores/operation";
import { useUserStore } from "@/stores/user";
import { useTaskStore } from "@/stores/task";
import { computed, onBeforeMount, ref, toRef, watch, type PropType, type Ref } from "vue";
import OperationParamsGenerator from "./OperationParamsGenerator.vue";
import { services } from "@/main";
// import SelectExecutor from "./SelectExecutor.vue";

const props = defineProps({
  operation: {
    type: Object as PropType<Operation>,
    default: () => {},
    required: true
  },
  event: {
    type: Object as PropType<Event | null>,
    default: () => {},
  },
  taskId: {
    type: Number,
    required: true,
  },
  pipeData: {
    type: Object as PropType<Task['pipe_data']>,
    default: {}
  }
});

const emit = defineEmits<{
  (e: "update", value: Task['pipe_data']): void;
}>();

const pipe_data: Ref<Task['pipe_data']> = ref({})

const activeTask = computed(()=> useTaskStore().getActiveTask)
const user = useUserStore().getUser
const TaskService = services.Task
const eventStatus = eventStatusOptions.find((ev) => props.event?.status === ev['id']);
const DIVISIONS_OPTIONS = useOperationStore().getDirectionOptions
const divisionsData = useUserStore().getDivisionsData
const USERS_OPTIONS = computed(()=>divisionsData[activeTask.value.division_id!]?.persons || [])

const canChangeEventParams = computed(()=>TaskService.canChangeEventParams(activeTask.value, user))

const setParams = (data: Task['pipe_data']) => {
  pipe_data.value=Object.assign(pipe_data.value, JSON.parse(JSON.stringify(data)))
}

function optionChangeHandle(value: number) {
    if(value===1){
      pipe_data.value['selected_users']=[]
      pipe_data.value['selected_divisions']=[]
    } else if (value===2){
      pipe_data.value['selected_users']=[]
    } else if (value===3){
      pipe_data.value['selected_divisions']=[]
    }
}

const executors = ref(1)

onBeforeMount(()=> {
  pipe_data.value = JSON.parse(JSON.stringify(props.pipeData))
  if(props.taskId<0){
      pipe_data.value['selected_divisions'] = [],
      pipe_data.value['selected_users']= []
  } else {
    if(pipe_data.value['selected_divisions'].length>0){
      executors.value=2
    }
    if(pipe_data.value['selected_users'].length>0){
      executors.value=3
    }
  }
})


watch(
  () => pipe_data.value,
  (newPipeData, oldPipeData) => {
    if(JSON.parse(JSON.stringify(newPipeData)) != JSON.parse(JSON.stringify(oldPipeData))){
      emit("update", pipe_data.value);
    }
  },
  {deep: true}
);

</script>
<template>
  <el-collapse-item>
    <template #title>
      <div class="collapse-item-header">
        <el-icon :color="eventStatus?.['color']">
          <SuccessFilled />
        </el-icon>
        <span class="ml-1">{{ operation?.name }}</span>
      </div>
    </template>
    <div class="row" v-if="event?.status">
      <div class="left">Статус</div>
      <div class="right">
        <el-tag class="status-tag" :color="eventStatus?.['color']">{{ eventStatus?.['value'] }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.created">
      <div class="left">Старт</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.created) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.modified">
      <div class="left">Изменено</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.modified) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.finished">
      <div class="left">Закончена</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.finished) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.user_name">
      <div class="left">Исполнитель</div>
      <div class="right">
        <el-tag>{{ event.user_name }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.result">
      <div class="left">Результат</div>
      <div class="right">
        {{ event.result['text']||'-' }}
      </div>
    </div>
    <!-- TO DO SHOW CONDITION -->
    <div v-if="!event">
      <OperationParamsGenerator 
        :key="taskId-operation.id" 
        :operation-id="operation.id" 
        :pipe-data="pipe_data" 
        :params="operation['params']"
        :can-change-event-params="canChangeEventParams"
        @update:value="setParams" 
      />
      <el-row><b>Кто видит задачу</b></el-row>
      <el-radio-group v-show="canChangeEventParams" v-model="executors" @change="optionChangeHandle">
          <el-radio :label="1">Все</el-radio>
          <el-radio :label="2">Группы пользователей</el-radio>
          <el-radio :label="3">Пользователи</el-radio>
      </el-radio-group>
      <el-row>
          <span style="margin-top:15px;" v-show="executors === 1">{{taskId>0 ? 'Задача видна всем пользователям' : 'Задача будет видна всем пользователям'}}</span>
          <el-select
              v-model="pipe_data['selected_divisions']"
              v-show="executors === 2"
              :disabled="!canChangeEventParams"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              placeholder="Выбрать группы"
              class="select-executor"
          >
          <el-option
              v-for="item in DIVISIONS_OPTIONS"
              :key="item['id']"
              :label="item['name']"
              :value="item['id']"
          />
          </el-select>
          <el-select
              v-model="pipe_data['selected_users']"
              v-show="executors === 3"
              :disabled="!canChangeEventParams"
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              placeholder="Выбрать людей"
              class="select-executor"
          >
          <el-option
              v-for="item in USERS_OPTIONS"
              :key="item.id"
              :label="item.fullname"
              :value="item.id"
          />
          </el-select>
      </el-row>
    </div>
  </el-collapse-item>
</template>
<style lang="sass">
.body .content
    display: flex
    flex-direction: column
    gap: 14px
    .row
        display: flex
        align-items: baseline
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
.el-tag
    color: #000
    border: none

.el-collapse .row
    margin-bottom: .5rem

.select-executor
  margin: 20px 0px
  width: 100%
</style>
