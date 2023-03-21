<script setup lang="ts">
import { useOperationStore } from "@/stores/operation";
import type { Operation } from "@/types/operation";
import { computed, type PropType, ref, toRef, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { Plus, Close, Delete, Bottom } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { Pipe } from "@/types/pipe";
import { pipeService } from "@/services/pipe";

const props = defineProps({
    pipe: {
        type: Object as PropType<Pipe|null>,
        default: () => ({
            name: '',
            value: []
        }),
    },
    loading: {
        type: Boolean,
        default: () => false
    }
})
const router = useRouter()
const user = useUserStore().getUser
const pipe = ref(props.pipe)

const operationStore = useOperationStore()
let operations = computed(()=>operationStore.getOperations)
const oldContent = ref('')
const wasChanged = computed(()=> {
    const updatedData = JSON.parse(JSON.stringify(pipe.value))
    return oldContent.value != JSON.stringify(updatedData)
})
const LOADING = toRef(props, 'loading')

//HOOKS
onMounted(()=> {
    oldContent.value=JSON.stringify(props.pipe)
})

//METHODS
const removeEventByIndex = (index: number) => {
    const value = pipe?.value?.value.filter((item,i)=>i!==index) || []
    if(pipe?.value) {
        pipe.value.value = value
    }
}
const addEvent = (id: number) => {
    pipe?.value?.value.push(id!)
}
const sendPipe = () => {
    if(LOADING.value)return;
    LOADING.value=true
    const msg = ElMessage({
        message: "Сохранение...",
        type: "warning",
        center: true,
        duration: 1000,
    });
    const data = {
        id: pipe?.value?.id,
        name: pipe?.value?.name,
        u_id: user?.id,
        value: pipe?.value?.value,
    }
    pipeService.sendPipe(data).then(res=>{
        if (errVueHandler(res)) {
            ElMessage({
                message: "Операция выполнена успешно!",
                type: "success",
                center: true,
                duration: 1500,
                showClose: true,
            });
            if(!pipe?.value?.id)router.push('/pipes')
            oldContent.value=JSON.stringify(pipe.value)
        }
        LOADING.value=false
        msg.close();
    })
}

//DRAG AND DROP
let draggableItem = ref<Operation|null>(null)
const stopAll = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const dragstartHandler= (ev: DragEvent, id: number) => {
    draggableItem.value = operations.value.find(op=>op?.id===id) || null
    const target = ev.target as Element
    target.classList.add('dragging')
    ev.dataTransfer!.effectAllowed = "link";
}
const dragoverHandler = (ev: DragEvent, targetIndex: number) => {
    stopAll(ev)
    const draggbleItemIndex = pipe?.value?.value.indexOf(draggableItem?.value!.id)
    if(draggbleItemIndex === targetIndex)return
    moveItemToIndex(draggbleItemIndex, targetIndex)
}
const dragendHandler = (ev: DragEvent) => {
    stopAll(ev)
    const target = ev.target as Element
    target.classList.remove('dragging')
}
const moveItemToIndex = (fromIndex: number|undefined, toIndex: number) => {
    const element = pipe?.value?.value[fromIndex!];
    pipe?.value?.value.splice(fromIndex!, 1);
    pipe?.value?.value.splice(toIndex, 0, element!);
}

</script>

<template>
      <el-card class="card" v-loading="loading">
        <template #header>
            <el-row justify="space-between">
                <h3>Пайплайн</h3>
                <div class="header-actions">
                    <el-button type="info" @click="router.push('/pipes')">Отмена</el-button>
                    <el-button :loading="LOADING" :disabled="!wasChanged || pipe?.value.length===0" type="success" @click="sendPipe()">Сохранить</el-button>
                </div>
            </el-row>
        </template>
        <el-row>
            <el-col :lg="12">
                <el-input class="card-name" v-model="pipe!.name" placeholder="Название" />
                <h4>Последовательность операций</h4>
                <div class="area" @dragend="dragendHandler($event)">
                    <template v-if="pipe?.value.length!>0" v-for="(id,index) in pipe?.value" :key="id">
                        <el-row align="middle">
                            <el-col :span="1">
                                <span style="color:#909399;">{{index+1}}.</span>
                            </el-col>
                            <el-col :span="23">
                                <div class="event" :data-index="index" draggable="true" @dragstart="dragstartHandler($event, id)" @dragover="dragoverHandler($event, index)">
                                    <span>{{operations!.find(oper=>oper!.id===id)?.name}}</span>
                                    <el-tooltip class="item" effect="dark" content="Удалить" placement="right-start">
                                        <el-button type="danger" icon="Delete" style="margin-left:auto" @keydown.enter="removeEventByIndex(index)" @click.stop="removeEventByIndex(index)"></el-button>
                                    </el-tooltip>
                                </div>
                            </el-col>
                        </el-row>
                    </template>
                    <el-empty v-else description="Список операций пуст" :image-size="80"></el-empty>
                </div>
            </el-col>
            <el-col :lg="12">
                <el-table class="table" :data="operations" height="300" size="medium">
                    <el-table-column label="Все операции" prop="name">
                    </el-table-column>
                    <el-table-column width="100">
                    <template #default="scope">
                        <el-tooltip class="item" effect="dark" content="Добавить" placement="right-start">
                            <el-button size="large" style="align-items:center" :icon="Plus" @keydown.enter="addEvent(scope.row.id)" @click="addEvent(scope.row.id)" @dragend="dragendHandler($event)"></el-button>
                        </el-tooltip>
                    </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="sass" scoped>
.area
    border: 2px solid #grey
    .event
        background-color: #fff
        border-color: #e9e9eb
        color: #909399
        display: flex
        width: min(100%, 500px)
        justify-content: center
        align-items: center
        height: 40px
        padding: 0 9px
        font-size: 16px
        line-height: 1
        border-width: 1px
        border-style: solid
        border-radius: 4px
        box-sizing: border-box
        white-space: nowrap
        margin: 10px 0px
        cursor: pointer
        &.dragging
            opacity: .6

.card
    width: min(100%, 1200px)
    margin: 20px auto
    &-name 
        width: min(100%, 400px)
.collapse
    width: min(100%, 400px)
</style>