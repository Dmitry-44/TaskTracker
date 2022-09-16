<script setup lang="ts">
import { useTaskStore, type Task } from '@/stores/task';
import { Close, Pointer, Notification, SuccessFilled } from "@element-plus/icons-vue";
import { computed } from '@vue/reactivity';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const store = useTaskStore()
const router = useRouter()
//GETTERS
const detailsWindow = computed(()=>store.getDetailsWindow) 
const task = computed(()=>store.getActiveTask) 
const readonlyTask = computed(()=> task.value.status===4)
const creatingTask = computed(()=>store.getCreatingTask)
const PIPES = computed(()=>store.getPipes)
const OPERATIONS = computed(()=>store.getOperations)
const PRIORITY_OPTIONS = store.getPriorityOptions
const STATUS_OPTIONS = store.getStatusOptions

//ACTIONS
const toggleDetailsWindow = store.toggleDetailsWindow
const setActiveTask = store.setActiveTask
const setCreatingTask = store.setCreatingTask

const openInNewTab = () => {
    let routeData = router.resolve({path: `/tasks/${task.value.id}`})
    window.open(routeData.href, '_blank');
}
const fetchPipesList = () => {
    store.fetchPipesList().then(res=> {
        if (
            Object.prototype.hasOwnProperty.call(res, "message") &&
            res.message === "ok"
          ) {
            store.setPipesList(res.result);
            return true;
          } else {
            return res.message || -1;
          }
    })
}

// const windowTitle = computed(()=>creatingTask.value ? 'Создание задачи' : 'Редактирование задачи')
const LOADING = ref(false)
let oldContent = ref('')
const wasChanged = computed(()=> {
    const updatedData = JSON.parse(JSON.stringify(task.value))
    return oldContent.value != JSON.stringify(updatedData)
})


//HOOKS
onBeforeMount(() => {
    fetchPipesList()
    store.fetchOperationsList().then(res=> {
      if (
          Object.prototype.hasOwnProperty.call(res, "message") &&
          res.message === "ok"
        ) {
          res.result
          store.setOperationsList(res.result)
          return true;
        } else {
          return res.message || -1;
        }
    })
});
watch(creatingTask, async (newVal, oldVal) => {
    if(newVal)oldContent.value=JSON.stringify({...task.value})
})


</script>
<template>
    <div :class="['details', detailsWindow.isOpened?'active':'']" @click.stop>
        <div class="header">
            <div class="actions">
                <template v-if="!creatingTask">
                    <el-tooltip v-if="!readonlyTask" class="item" effect="dark" content="Взять задачу" placement="top-start">
                        <el-button :icon="Pointer"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Открыть в новой вкладке" placement="top-start">
                        <el-button :icon="Notification" @click.stop="openInNewTab()"></el-button>
                    </el-tooltip>
                </template>
                <el-button v-else :loading="LOADING" :disabled="!wasChanged" type="success" @click="sendTask()">Сохранить</el-button>
                <el-tooltip class="item" effect="dark" content="Закрыть" placement="top-start">
                    <el-button class="close-btn" :icon="Close" @click.stop="toggleDetailsWindow(false),setActiveTask(null),setCreatingTask(false)"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="body">
            <div class="title_block">
                <input 
                v-model="task.title"
                :disabled="readonlyTask"
                class="title-input" 
                placeholder="Ввести название задачи"
                >
            </div>
            <div class="content">
                <div class="row">
                    <div class="left">Задача</div>
                    <div class="right">
                        <el-select
                        v-model="task.pipe_id"
                        :disabled="readonlyTask || task?.status!>2"
                        clearable 
                        placeholder="Задача"
                        >
                            <el-option
                            v-for="item in PIPES"
                            :key="item?.id"
                            :label="item?.name"
                            :value="item?.id"
                            >
                            </el-option>
                        </el-select>
                        <!-- <div v-else>{{PIPES.find(pipe=>pipe?.id===task.pipe_id)?.name}}</div> -->
                    </div>
                </div>
                <div class="row">
                    <div class="left">Приоритет</div>
                    <div class="right">
                        <el-select v-model="task.priority" :disabled="readonlyTask" clearable placeholder="Приоритет">
                            <el-option
                            v-for="item in PRIORITY_OPTIONS"
                            :key="item.value"
                            :label="item.value"
                            :value="item.id"
                            >
                            <el-tag :color="item.color">{{item.value}}</el-tag>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                    <div class="left">Статус</div>
                    <div class="right">
                        <el-select v-model="task.status" :disabled="readonlyTask" clearable placeholder="Статус" style="box-shadow:none">
                            <el-option
                            v-for="item in STATUS_OPTIONS"
                            :key="item.value"
                            :label="item.value"
                            :value="item.id"
                            >
                            <el-tag :color="item.color">{{item.value}}</el-tag>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                    <div class="left">Текст</div>
                    <div class="right text">
                        <el-input
                            v-model="task.text"
                            :disabled="readonlyTask"
                            clearable
                            :autosize="{ minRows: 2, maxRows: 4 }"
                            type="textarea"
                            placeholder="Текст задачи"
                        />
                    </div>
                </div>
                <div v-if="task.pipe_id">
                    <span class="left mt-2">Этапы</span>
                    <el-collapse>
                        <el-collapse-item v-for="operation in task.event_entities" :title="OPERATIONS.find(oper=> oper.id==operation?.operation_id!)!.name" :name="operation?.id">
                            <template #title>
                                <div class="collapse-item-header">
                                    <el-icon :color="operation.status===3 ? '#67C23A' : ''">
                                        <SuccessFilled />
                                    </el-icon>
                                    <span class="ml-1">{{OPERATIONS.find(oper=> oper.id==operation?.operation_id!)!.name}}</span>
                                </div>
                            </template>
                            <div class="row">
                                <div class="left">Статус</div>
                                <div class="right">
                                    <template v-if="operation.status===3">
                                        <el-tag type="success">Готово</el-tag>
                                    </template>
                                    <el-tag v-else color="#f8df72">В работе</el-tag>
                                </div>
                            </div>
                            <div class="row">
                                <div class="left">Старт</div>
                                <div class="right">
                                    <el-tag>{{new Date(operation.created*1000).toLocaleString()}}</el-tag>
                                </div>
                            </div>
                            <div class="row" v-if="operation.finished">
                                <div class="left">Финиш</div>
                                <div class="right">
                                    <el-tag>{{new Date(operation.finished*1000).toLocaleString()}}</el-tag>
                                </div>
                            </div>
                            <div class="row" v-if="operation.user_name">
                                <div class="left">Исполнитель</div>
                                <div class="right">
                                    <el-tag>{{operation.user_name}}</el-tag>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.details
    box-shadow: 0 0 0 1px #edeae9, 0 5px 20px 0 rgba(109, 110, 111, 0.08)
    background-color: #fff
    // border-top: 1px solid #edeae9
    display: flex
    flex-direction: column
    right: 0
    position: fixed
    top: 60px
    bottom: 0
    width: 0
    z-index: 600
    transition: all .8s cubic-bezier(0.23, 1, 0.32, 1)
    visibility: hidden
    &.active
        width: min(700px, 60%)
        // transform: translateX(-100px)
        visibility: visible
.details .header
    height: 50px
    padding: 0px 12px
    display: flex
    .actions
        margin-left: auto
        display: flex
        align-items: center
.details .body
    display: flex
    flex-direction: column
    flex: 1 0 auto
    min-height: 1px
    z-index: 0
    background: #fff
    padding: 0 24px
    border-top: 1px solid #edeae9
.title_block input
    z-index: 0
    background-color: #fff
    border-width: 1px
    border-style: solid
    border-color: #fff
    border-radius: 6px
    box-sizing: border-box
    overflow-wrap: break-word
    padding: 6px 12px
    resize: none
    white-space: pre-wrap
    height: auto
    font-size: 20px
    letter-spacing: .8px
    font-weight: 500
    line-height: 32px
    min-height: 0
    width: 100%
    margin: 12px 0px
    margin-left: -12px
    &:hover
        border-color: #cfcbcb

.header .title
    text-transform: uppercase
    text-indent: 10px
    margin: 10px 0px
    color: #303133
.body .content
    display: flex
    flex-direction: column
    gap: 14px
    .row
        display: flex
        align-items: baseline
    .left
        flex: 0 0 120px
        color: #6d6e6f
        font-size: 15px
        line-height: 18px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
    .right
        flex: 1 1 auto
        overflow-x: clip

.body .content .row .text textarea
    border-color: #fff
.el-select .el-input__wrapper
    box-shadow: none
    &:hover
        box-shadow:  0 0 0 1px #dcdfe6 inset

.el-select .el-input__wrapper
    box-shadow: none !important
.el-tag
    color: #000
    border: none

.el-collapse .row
    margin-bottom: .5rem


</style>