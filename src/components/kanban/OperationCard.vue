<script setup lang="ts">
import { useTaskStore, type Operation } from "@/stores/task";
import { computed, type PropType, ref, toRef, onBeforeMount, onMounted, onBeforeUnmount, watch, type ComputedRef } from "vue";
import { Plus, Close, Delete, Bottom } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { errVueHandler } from "@/plugins/errorResponser";
import JsonEditor from "../JsonEditor.vue";


const props = defineProps({
    operationData: {
        type: Object as PropType<Operation>,
        default: () => ({
            name: '',
            params: {}
        }),
    },
    loading: {
        type: Boolean,
        default: () => false
    }
})
const router = useRouter()
const paramsInput = ref<HTMLInputElement|any>(null)
let params = ref(props.operationData?.params)
let operationParams = computed(()=>JSON.parse(operationParamsString.value)) as ComputedRef<Object>
let operationParamsString = ref(JSON.stringify(props.operationData?.params, null, 2))
let operation = ref({...props.operationData, params: operationParams})

const store = useTaskStore()
const oldContent = ref('')
const wasChanged = computed(()=> {
    const updatedData = JSON.parse(JSON.stringify(operation.value))
    return oldContent.value != JSON.stringify(updatedData)
})
const LOADING = ref(false)
const paramsEditor = ref<HTMLInputElement|any>(null)

watch(
    () => operationParams,
    () => {
        operation.value.params=operationParams
    }
)
//HOOKS
onMounted(()=> {
    oldContent.value=JSON.stringify(props.operationData)
})

//METHODS
const sendOperation = () => {
    if(LOADING.value)return;
    LOADING.value=true
    const msg = ElMessage({
        message: "Сохранение...",
        type: "warning",
        center: true,
        duration: 1000,
    });
    const data = {
        id: operation?.value?.id,
        name: operation?.value?.name,
        params: operation?.value?.params,
    }
    store.sendOperation(data).then(res=>{
        if (errVueHandler(res)) {
            ElMessage({
                message: "Операция выполнена успешно!",
                type: "success",
                center: true,
                duration: 1500,
                showClose: true,
            });
            if(!operation?.value?.id)router.push('/operations')
            oldContent.value=JSON.stringify(operation.value)
        }
        LOADING.value=false
        msg.close();
    })
}
const paramUpdateHandle = (val: Object) => {
    console.log('val', val)
    operation.value.params=val
    // params.value = val
}


</script>

<template>
      <el-card class="card" v-loading="loading">
        <template #header>
            <el-row justify="space-between">
                <h3>Операция</h3>
                <div class="header-actions">
                    <el-button type="info" @click="router.push('/operations')">Отмена</el-button>
                    <el-button :loading="LOADING" :disabled="!wasChanged" type="success" @click="sendOperation()">Сохранить</el-button>
                </div>
            </el-row>
        </template>
        <!-- <el-row justify="center"> -->
            <div>
                <h4>Заголовок</h4>
                <el-input class="card-name mb-4" label="Заголовок" v-model="operation.name" placeholder="Название" />
            </div>
        <!-- </el-row>
        <el-row justify="center"> -->
            <div>
                <h4>Параметры</h4>
                <JsonEditor :data="params" @update="paramUpdateHandle" ref="paramsEditor"/>
                <!-- <el-input
                    @keydown.tab.prevent
                    v-model="operationParamsString"
                    :autosize="{ minRows: 2, maxRows: 100 }"
                    type="textarea"
                    class="input-textarea"
                    placeholder="Параметры операции"
                    ref="paramsInput"
                /> -->
            </div>
        <!-- </el-row> -->
    </el-card>
</template>

<style lang="sass" scoped>
.card
    width: min(100%, 1200px)
    margin: 20px auto
    &-name 
        width: min(100%, 400px)
</style>