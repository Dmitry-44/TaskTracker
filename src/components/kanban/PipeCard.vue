<script setup lang="ts">
import { useTaskStore, type Pipe, type Operation } from "@/stores/task";
import { computed, type PropType, ref, toRef, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { Plus, Close, Delete, Bottom } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const props = defineProps({
    pipeData: {
        type: Object as PropType<Pipe>,
        default: () => ({
            name: '',
            value: []
        }),
    }
})
const router = useRouter()
const user = useUserStore().getUser
const pipe = ref(props.pipeData)

const store = useTaskStore()
const operations = computed(()=>store.getOperations)
const oldContent = ref('')
const wasChanged = computed(()=> {
    const updatedData = JSON.parse(JSON.stringify(pipe.value))
    return oldContent.value != JSON.stringify(updatedData)
})
const LOADING = ref(false)

//HOOKS
onMounted(()=> {
    oldContent.value=JSON.stringify(props.pipeData)
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
    LOADING.value=true
    const data = {id:pipe?.value?.id,name:pipe?.value?.name,u_id:user?.id,value:pipe?.value?.value}
    store.sendPipe(data).then(res=>{
        if(res){
            if(!pipe?.value?.id)router.push('/pipes')
            LOADING.value=false
        }
        oldContent.value=JSON.stringify(pipe.value)
    })
}

//DRAG AND DROP
// const transferItem = ref<Pipe|null>(null)
const taskInProcessArea = ref<any|HTMLDivElement>(null)
const tasksToTakeArea = ref<any|HTMLDivElement>(null)
let draggableItem = ref<Operation|null>(null)
const stopAll = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const dragstartHandler= (ev: DragEvent, event: Operation) => {
    draggableItem.value = event
    const target = ev.target as Element
    target.classList.add('dragging')
    ev.dataTransfer!.setData("text/html", target.outerHTML);
    ev.dataTransfer!.effectAllowed = "link";
}
const dragoverHandler = (ev: DragEvent) => {
    stopAll(ev)
    ev.dataTransfer!.effectAllowed = "link"
    const target = ev.target as Element
    const transferItem = ev.dataTransfer!.getData("text/html")
    const index = Number(target.getAttribute('data-index')) || null
    if(index===data.value.map(item=>item.id).indexOf(draggableItem!.value!.id))return false
    moveItemToIndex(draggableItem!.value!, index)
    // const draggableIndex: number
    // if(draggableItem.value.id) {

    // }
    // draggableIndex = data.value.map(item => item.id).indexOf(draggableItem.value.id)
    // if(data.value.map(item => item.id).indexOf(draggableItem.value.id))
    // target.insertAdjacentHTML( 'afterend', transferItem )

}
const dragleaveHandler = (ev: DragEvent) => {
    stopAll(ev)
    tasksToTakeArea.value.classList.remove('dragOver')
    taskInProcessArea.value.classList.remove('dragOver')
}
const dropHandler = (ev: DragEvent, area: number) => {
    // ev.dataTransfer!.dropEffect = "link";
    // tasks.value.map(task=>{if(task.id===transferTask?.value?.id) {task.status=areaParams.get(area)?.status || 2}})
    // tasksToTakeArea.value.classList.remove('dragOver')
    // taskInProcessArea.value.classList.remove('dragOver')
}

const moveItemToIndex = (pipe: Operation, toIndex: number|null) => {
    if(!toIndex)return false
    const fromIndex = data.value.map(pipe=>pipe.id).indexOf(pipe.id);
    const [element] = data.value.splice(0, 1);
    console.log({'fromIndex': fromIndex, 'toIndex': toIndex})
    data.value.splice(toIndex, 0, element);
}
const dragendHandler = (ev: DragEvent) => {
    const target = ev.target as Element
    target.classList.remove('dragging')
}



</script>
<template>
      <el-card class="card">
        <template #header>
            <el-row justify="space-between">
                <h3>Пайплайн</h3>
                <div class="header-actions">
                    <el-button type="info" @click="router.push('/pipes')">Отмена</el-button>
                    <el-button :loading="LOADING" :disabled="!wasChanged" type="success" @click="sendPipe()">Сохранить</el-button>
                </div>
            </el-row>
        </template>
        <el-row>
            <el-col :lg="12">
                <el-input class="card-name" v-model="pipe.name" placeholder="Название" />
                <h4>Список операций</h4>
                <div class="area">
                    <template v-if="pipe?.value.length!>0" v-for="(id,index) in pipe?.value" :key="id">
                        <el-row align="middle">
                            <el-col :span="1">
                                <span style="color:#909399;">{{index+1}}.</span>
                            </el-col>
                            <el-col :span="23">
                                <div class="event" :data-index="index" draggable="true" @dragstart="dragstartHandler($event, event)" @dragover="dragoverHandler($event)" @dragend="dragendHandler($event)">
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