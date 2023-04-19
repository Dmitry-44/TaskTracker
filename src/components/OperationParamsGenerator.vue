<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { useSitesStore } from '@/stores/sites';
import { onBeforeMount, onMounted, onUpdated, ref, toRef, watch, type PropType, type Ref } from 'vue';
import { getPipeDataFromOperationParams, type Task } from '@/entities/task'
import { taskTimeOptions as TASK_TIME_OPTIONS } from '@/entities/task'
import type { Operation } from '@/entities/operation';

const props = defineProps({
    params: {
        type: Object as PropType<Record<string,any>>,
        default: {},
        required: true
    },
    operationId: {
        type: Number as PropType<Operation['id']>,
        required: true
    },
    pipeData: {
        type: Object as PropType<Task['pipe_data']>,
        default: {}
    },
    canChangeEventParams: {
        type: Boolean,
        default: true,
    }
})
const emit = defineEmits<{
  (e: "update:value", value: Task['pipe_data']): void;
}>();

const pipeOptions: Ref<Task['pipe_data']> = ref(Object.assign(getPipeDataFromOperationParams(props.params), JSON.parse(JSON.stringify(props.pipeData))))
const DIRECTION_OPTIONS = useOperationStore().getDirectionOptions
const SITE_OPTIONS = useSitesStore().getList

watch(
  () => pipeOptions.value,
  () => {
    emit('update:value', pipeOptions.value)
  },
  {deep: true}
);

</script>

<template>
    <span v-if="pipeOptions['auto']">Параметры данной операции будут заданы автоматически</span>
    <div v-else>
        <template v-if="'direction' in pipeOptions">
            <span class="param-name"><b>Направление</b></span>
            <el-row>
                <el-select
                    v-model="pipeOptions['direction']"
                    placeholder="Выбрать направление"
                    :disabled="!canChangeEventParams"
                >
                <el-option
                    v-for="item in DIRECTION_OPTIONS"
                    :key="item['id']"
                    :label="item['name']"
                    :value="item['id']"
                />
                </el-select>
            </el-row>
            <el-divider></el-divider>
        </template>
        <template v-if="'time' in pipeOptions">
            <span class="param-name"><b>Время на задачу</b></span>
            <el-row>
                <el-select
                    v-model="pipeOptions['time']"
                    placeholder="Выбрать сайты"
                    :disabled="!canChangeEventParams"
                >
                <el-option
                    v-for="item in TASK_TIME_OPTIONS"
                    :key="item['value']"
                    :label="item['time']"
                    :value="item['value']"
                />
                </el-select>
            </el-row>
            <el-divider></el-divider>
        </template>
        <template v-if="'site_ids' in pipeOptions">
            <span class="param-name"><b>На сайты</b></span>
            <el-row>
                <el-select
                    v-model="pipeOptions['site_ids']"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :max-collapse-tags="3"
                    clearable
                    placeholder="Выбрать сайты"
                    :disabled="!canChangeEventParams"
                >
                <el-option
                    v-for="item in SITE_OPTIONS"
                    :key="item['id']"
                    :label="item['url']"
                    :value="item['id']"
                />
                </el-select>
            </el-row>
            <el-divider></el-divider>
        </template>
        <template v-if="'site_id' in pipeOptions">
            <span class="param-name"><b>На сайт</b></span>
            <el-row>
                <el-select
                    v-model="pipeOptions['site_id']"
                    placeholder="Выбрать сайт"
                    :disabled="!canChangeEventParams"
                    clearable
                >
                <el-option
                    v-for="item in SITE_OPTIONS"
                    :key="item['id']"
                    :label="item['url']"
                    :value="item['id']"
                />
                </el-select>
            </el-row>
            <el-divider></el-divider>
        </template>
    </div>

</template>