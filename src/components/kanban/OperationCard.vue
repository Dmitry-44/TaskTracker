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

//VARIABLES
const router = useRouter()
const store = useTaskStore()
const paramsEditor = ref<HTMLInputElement|any>(null)

let params = ref(props.operationData?.params)
let operation = ref(props.operationData)
let oldContent = ref('')
let wasChanged = computed(()=> {
    const updatedData = JSON.parse(JSON.stringify(operation.value))
    return oldContent.value != JSON.stringify(updatedData)
})
let LOADING = ref(false)

//HOOKS
onMounted(()=> {
    oldContent.value=JSON.stringify(props.operationData)
})

//METHODS
const paramUpdateHandle = (val: Object) => {
    operation.value!.params=val
}
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
        <div>
            <h4>Заголовок</h4>
            <el-input class="card-name mb-4" label="Заголовок" v-model="operation.name" placeholder="Название" />
        </div>
        <div>
            <h4>Параметры</h4>
            <JsonEditor :data="params" @update="paramUpdateHandle" ref="paramsEditor"/>
        </div>
    </el-card>
</template>

<style lang="sass" scoped>
.card
    width: min(100%, 1200px)
    margin: 20px auto
    &-name 
        width: min(100%, 400px)
</style>