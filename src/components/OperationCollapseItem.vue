<script setup lang="ts">
import { EventStatus, eventStatusOptions, type Event } from "@/entities/event";
import type { Operation } from "@/entities/operation";
import type { Task } from "@/entities/task";
import { useUserStore } from "@/stores/user";
import { computed, onBeforeMount, onBeforeUnmount, ref, toRef, watch, type PropType, type Ref } from "vue";
import cloneDeep from 'lodash/cloneDeep';
import OperationLoader from "@/components/OperationLoader.vue";
import EventData from "./EventData.vue";

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
  activeDivisionId: {
    type: Number,
    default: -1,
  },
  pipeData: {
    type: Object as PropType<Task['pipe_data']>,
    default: {}
  },
  canSelectExecutors: {
    type: Boolean,
    default: false
  },
  canChangeEventParams: {
    type: Boolean,
    default: true,
  }
});

const taskPipeData = toRef(props, 'pipeData')
const emit = defineEmits<{
  (e: "update", value: Event['params']): void;
}>();


const eventStatus = eventStatusOptions.find((ev) => props.event?.status === ev['id']);
//toDO
const DIVISIONS_OPTIONS: any[] = []
const divisionsData = useUserStore().getDivisionsData
const USERS_OPTIONS = computed(()=>divisionsData[props.activeDivisionId]?.persons || [])
const executors = ref(1)

function optionChangeHandle(value: number) {
    if(value===1){
      taskPipeData.value['selected_users']=[]
      taskPipeData.value['selected_divisions']=[]
    } else if (value===2){
      taskPipeData.value['selected_users']=[]
    } else if (value===3){
      taskPipeData.value['selected_divisions']=[]
    }
}

onBeforeMount(()=> {
  if(props.taskId<0){
      emit("update", cloneDeep(taskPipeData.value));
  } else {
    if(taskPipeData.value['selected_divisions']?.length>0){
      executors.value=2
    }
    if(taskPipeData.value['selected_users']?.length>0){
      executors.value=3
    }
  }
  optionChangeHandle(executors.value)
})

watch(
  () => executors.value,
  (newValue, oldValue) => {
    optionChangeHandle(newValue)
  },
);

</script>

<template>
  <el-collapse-item class="collapse-item">
    <template #title>
      <div class="collapse-item-header">
        <el-icon :color="eventStatus?.['color']">
          <SuccessFilled />
        </el-icon>
        <span class="ml-1 operation-item-name">{{ operation.name.toUpperCase() }}</span>
      </div>
    </template>
    <div class="row">
      <div class="left">Задача</div>
      <div class="right">
        <el-tag class="tag-info">{{ operation.name }}</el-tag>
      </div>
    </div>
    <EventData 
      v-if="event" 
      :key="`${taskId}-${event.id}`" 
      :event="event"
      />
    <!-- TO DO SHOW CONDITION -->
    <div>
      <OperationLoader 
        :id="operation.id"  
        :params="event ? event?.params : pipeData" 
        @update:params="$event=>emit('update', $event)" 
        :readonly="event ? true : false"
      />
      <div v-show="!event||event.status===EventStatus.CREATED">
        <el-row><b>Кто видит задачу</b></el-row>
        <el-radio-group v-show="canChangeEventParams&&canSelectExecutors" v-model="executors">
            <el-radio :label="1">Все</el-radio>
            <el-radio :label="2">Группы пользователей</el-radio>
            <el-radio :label="3">Пользователи</el-radio>
        </el-radio-group>
        <el-row>
            <span style="margin-top:15px;" v-show="executors === 1">{{taskId>0 ? 'Задача видна всем пользователям' : 'Задача будет видна всем пользователям'}}</span>
            <el-select
                v-model="taskPipeData['selected_divisions']"
                v-show="executors === 2"
                :disabled="!canChangeEventParams||!canSelectExecutors"
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
                v-model="taskPipeData['selected_users']"
                v-show="executors === 3"
                :disabled="!canChangeEventParams||!canSelectExecutors"
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
    </div>
  </el-collapse-item>
</template>
<style lang="sass">
.collapse-item.is-active
  transition: border .3s ease-in
  border-bottom: 1px solid black
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
