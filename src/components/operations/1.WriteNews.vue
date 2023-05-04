<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { ref, watch, type PropType } from 'vue';
import { taskTimeOptions as TASK_TIME_OPTIONS } from '@/entities/task'

const props = defineProps({
    modelValue: {           
      type: Object as PropType<Record<string,any>>,
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
  (e: "update:modelValue", value: Object): void;
}>();

const params = ref(props.modelValue)
const DIRECTION_OPTIONS = useOperationStore().getDirectionOptions

watch(
    ()=> params.value,
    (newParams, oldParams)=>{
        emit('update:modelValue', newParams)
    }
)

</script>
<template>
    <div class="row">
        <div class="left">Направление</div>
        <div class="right">
            <el-select
                v-model="params['direction']"
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
        </div>
    </div>
    <div class="row">
        <div class="left">Время на задачу</div>
        <div class="right">
            <el-select
                v-model="params['time']"
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
        </div>
    </div>
</template>