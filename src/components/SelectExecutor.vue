<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { useUserStore } from '@/stores/user';
import { useTaskStore } from '@/stores/task';
import { computed, onBeforeMount, onMounted, ref, toRef, type PropType } from 'vue';
import type { Operation } from '@/types/operation';

const props = defineProps({
    users: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: []
    },
    operation: {
        type: Object as PropType<Operation>,
        default: {}
    }
})

const task = computed(()=> useTaskStore().getActiveTask)
const operationId = computed(()=>props.operation.id)
const DIVISIONS_OPTIONS = useOperationStore().getDirectionOptions
const USERS_OPTIONS = useUserStore().getAllUsers
const executors = ref(1)

onBeforeMount(()=> {
    // if(!(task.value.id > 0)){
        task.value.pipe_data[operationId.value]= {}
        task.value.pipe_data[operationId.value]['selected_users']=[]
        task.value.pipe_data[operationId.value]['selected_divisions']=[]
    // } else {
    //     if(task.value.pipe_data[operationId.value]['selected_users'].length > 0) {
    //         executors.value=3
    //     } else if(task.value.pipe_data[operationId.value]['selected_divisions'] > 0) {
    //         executors.value=2
    //     }
    // }


})

function optionChangeHandle(value: number) {
    if(value===1){
        task.value.pipe_data[operationId.value]['selected_users']=[]
        task.value.pipe_data[operationId.value]['selected_divisions']=[]
    } else if (value===2){
        task.value.pipe_data[operationId.value]['selected_users']=[]
    } else if (value===3){
        task.value.pipe_data[operationId.value]['selected_divisions']=[]
    }
}
</script>

<template>
    <el-radio-group v-model="executors" @change="optionChangeHandle">
        <el-radio :label="1">Все</el-radio>
        <el-radio :label="2">Группы пользователей</el-radio>
        <el-radio :label="3">Пользователи</el-radio>
    </el-radio-group>
    <el-row>
        <el-select
            v-model="task.pipe_data[operationId]['selected_divisions']"
            v-show="executors === 2"
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
            v-model="task.pipe_data[operationId]['selected_users']"
            v-show="executors === 3"
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
</template>

<style>
.select-executor {
    margin: 20px 0px;
    width: 100%;
}
</style>