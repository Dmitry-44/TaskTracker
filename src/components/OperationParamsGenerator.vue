<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { useSitesStore } from '@/stores/sites';
import { toRef, watch, type PropType, type Ref } from 'vue';
import type{ Task } from '@/entities/task'
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

const taskPipeData = toRef(props, 'pipeData')
const DIRECTION_OPTIONS = useOperationStore().getDirectionOptions
const SITE_OPTIONS = useSitesStore().getList

const clearSiteId = () => {
    console.log('ssssss clear!!')
    delete taskPipeData.value['time']
}
const changeSiteId = (value: string) => {
    console.log('change value', value)

}

</script>

<template>
    <span v-if="params['auto']">Параметры данной операции будут заданы автоматически</span>
    <div v-else>
        <template v-if="'direction' in params">
            <div class="row">
                <div class="left">Направление</div>
                <div class="right">
                    <el-select
                        v-model="taskPipeData['direction']"
                        placeholder="Выбрать направление"
                        :disabled="!canChangeEventParams"
                        clearable
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
            <!-- <el-divider></el-divider> -->
        </template>
        <template v-if="'time' in params">
            <div class="row">
                <div class="left">Время на задачу</div>
                <div class="right">
                    <el-select
                        v-model="taskPipeData['time']"
                        placeholder="Выбрать время на задачу"
                        :disabled="!canChangeEventParams"
                        clearable
                        @clear="clearSiteId"
                        @change="changeSiteId"
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
            <!-- <el-divider></el-divider> -->
        </template>
        <template v-if="'site_ids' in params">
            <div class="row">
                <div class="left">На сайты</div>
                <div class="right">
                    <el-select
                        v-model="taskPipeData['site_ids']"
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
                </div>
            </div>
            <!-- <el-divider></el-divider> -->
        </template>
        <template v-if="'site_id' in params">
            <div class="row">
                <div class="left">На сайт</div>
                <div class="right">
                    <el-select
                        v-model="taskPipeData['site_id']"
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
                </div>
            </div>
            <!-- <el-divider></el-divider> -->
        </template>
    </div>

</template>