<script setup lang="ts">
import { useTaskStore, type Operation}  from '@/stores/task';
import { computed, onBeforeMount, ref } from 'vue';


const props = defineProps({
    active: {
        type: Boolean,
        default:()=>false
    },
    title: {
        type: String,
        default:()=>''
    }
})
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', value: Operation): void
}>()

const taskStore = useTaskStore()
const OPERATIONS = computed(()=>taskStore.getOperations)
let LOADING = ref(false)

const fetchOperationsList = async() => {
    taskStore.fetchOperationsList().then(res=> {
        if (
            Object.prototype.hasOwnProperty.call(res, "message") &&
            res.message === "ok"
          ) {
            taskStore.setOperationsList(res.result);
            return true;
          } else {
            return res.message || -1;
          }
    })
}

let activeEventId = ref(null)
let activeEvent = computed<Operation|null>(()=> OPERATIONS.value.find(oper=>oper?.id===activeEventId.value) || null)

onBeforeMount(async()=> {
    LOADING.value=true
    await fetchOperationsList()
    LOADING.value=false
})


</script>

<template>
    <el-dialog
        v-model="active"
        :title="LOADING?'Загрузка данных':title"
        width="30%"
        @close="$emit('close')"
    >
        <el-select v-model="activeEventId" :disabled="LOADING" class="m-2" placeholder="Выбрать операцию" size="large">
            <el-option
            v-for="event in OPERATIONS"
            :key="event?.id"
            :label="event?.name"
            :value="event?.id"
            />
        </el-select>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="$emit('close')">Отмена</el-button>
            <el-button type="primary" @click="$emit('update', activeEvent),$emit('close')"
            >Ок</el-button
            >
        </span>
        </template>
    </el-dialog>
</template>

<style lang="sass">
.el-select
    display: block
</style>