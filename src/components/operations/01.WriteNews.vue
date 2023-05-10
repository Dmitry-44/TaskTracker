<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { computed, ref, watch, type PropType } from 'vue';
import { taskTimeOptions as TASK_TIME_OPTIONS } from '@/entities/task'
import type { Event } from '@/entities/event';

const props = defineProps({
    modelValue: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        direction: 0,
        time: null
      })
    },
    params: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        direction: 0,
        time: null
      })
    },
    readonly: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits<{
  (e: "update:params", value: Event['params']): void;
}>();

const params = ref(props.modelValue)
const DIRECTION_OPTIONS = useOperationStore().getDirectionOptions

const activeDirection = computed(()=>DIRECTION_OPTIONS.find(dir=>dir['id']===params.value!['direction']))
const activeTime = computed(()=>TASK_TIME_OPTIONS.find(time=>time['value']===params.value!['time']))

watch(
    ()=> props.modelValue,
    (newValue, oldValue)=>{
        params.value=newValue
    }
)
if(!props.readonly){
    watch(
        ()=> params.value,
        (newParams, oldParams)=>{
            emit('update:params', newParams)
        },
        {deep: true}
    )
}
</script>

<template>
    <div class="row">
        <div class="left">Направление</div>
        <div class="right">
            <el-select
                v-if="!readonly"
                v-model="params!['direction']"
                placeholder="Выбрать направление"
                :disabled="readonly"
            >
            <el-option
                v-for="item in DIRECTION_OPTIONS"
                :key="item['id']"
                :label="item['name']"
                :value="item['id']"
            />
            </el-select>
            <el-tag v-else class="tag-info">{{ activeDirection?.['name'] }}</el-tag>
        </div>
    </div>
    <div class="row">
        <div class="left">Время на задачу</div>
        <div class="right">
            <el-select
                v-if="!readonly"
                v-model="params!['time']"
                placeholder="Выбрать время на задачу"
                :disabled="readonly"
            >
            <el-option
                v-for="item in TASK_TIME_OPTIONS"
                :key="item['value']"
                :label="item['time']"
                :value="item['value']"
            />
            </el-select>
            <el-tag v-else class="tag-info">{{ activeTime?.['time'] || '-' }}</el-tag>
        </div>
    </div>
</template>