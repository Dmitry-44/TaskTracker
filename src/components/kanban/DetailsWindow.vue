<script setup lang="ts">
import { useTaskStore, type Task } from '@/stores/task';
import { Close, Pointer, Notification } from "@element-plus/icons-vue";
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useTaskStore()
const router = useRouter()
//GETTERS
const detailsWindow = computed(()=>store.getDetailsWindow) 
const task = computed(()=>store.getActiveTask) 
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
    // let routeData = router.resolve({path: `/tasks/${activeTask.value.id}`})
    // window.open(routeData.href, '_blank');
}

// const task = computed(()=> creatingTask.value ? taskDefault.value : activeTask.value)
const windowTitle = computed(()=>creatingTask.value ? 'Создание задачи' : 'Редактирование задачи')

// const taskPipe = computed(() => PIPES.value.filter(pipe => pipe.id===task.value.pipe_id))
// const taskOperations = computed(() => taskPipe.value ? taskPipe.value[0].value.map(id => OPERATIONS.value.find(val=> val.id===id)) : [])

// const taskDefault = ref({id:-1001,title:"",text:"",priority:null,status:null,pipe_id:null,event_id:-1,division_id:-1,created_by:-1,events:[],event_entities:[]})

</script>
<template>
    <div :class="['details', detailsWindow.isOpened?'active':'']" @click.stop>
        <div class="header">
            <h4 class="title">{{windowTitle}}</h4>
            <div class="actions">
                <template v-if="!creatingTask">
                    <el-tooltip class="item" effect="dark" content="Взять задачу" placement="top-start">
                        <el-button :icon="Pointer"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Открыть в новой вкладке" placement="top-start">
                        <el-button :icon="Notification" @click.stop="openInNewTab()"></el-button>
                    </el-tooltip>
                </template>
                <el-tooltip class="item" effect="dark" content="Закрыть" placement="top-start">
                    <el-button class="close-btn" :icon="Close" @click.stop="toggleDetailsWindow(false),setActiveTask(null),setCreatingTask(false)"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="body">
            <div class="title_block">
                <input 
                v-model="task.title"
                class="title-input" 
                placeholder="Ввести название задачи"
                >
            </div>
            <div class="content">
                <div class="row">
                    <div class="left">Задача</div>
                    <div class="right">
                        <el-select
                        v-if="task.status<=2"
                        v-model="task.pipe_id"
                        clearable 
                        placeholder="Задача"
                        >
                            <el-option
                            v-for="item in PIPES"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <div v-else>{{PIPES.filter(pipe=>pipe.id===task.pipe_id)[0]?.name}}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="left">Приоритет</div>
                    <div class="right">
                        <el-select v-model="task.priority" clearable placeholder="Приоритет">
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
                        <el-select v-model="task.status" clearable placeholder="Статус">
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
                            clearable
                            :autosize="{ minRows: 2, maxRows: 4 }"
                            type="textarea"
                            placeholder="Текст задачи"
                        />
                    </div>
                </div>
                <!-- <div v-if="taskOperations">
                    Этапы
                <el-collapse>
                    <el-collapse-item v-for="operation in task.event_entities" :title="operation?.id" :name="operation?.id">
                        <div class="row">
                            <div class="left">Статус</div>
                            <div class="right">
                                <el-tag>{{operation.status}}</el-tag>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.details
    box-shadow: 0 0 0 1px #edeae9, 0 5px 20px 0 rgba(109, 110, 111, 0.08)
    background-color: #fff
    border-top: 1px solid #edeae9
    display: flex
    flex-direction: column
    right: 0
    position: absolute
    top: 0
    bottom: 0
    width: 0
    z-index: 600
    transition: all .8s cubic-bezier(0.23, 1, 0.32, 1)
    visibility: hidden
    &.active
        width: min(700px, 60%)
        transform: translateX(-100px)
        visibility: visible
.details .header
    padding: 12px
    display: flex
    .actions
        margin-left: auto
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
.el-tag
    color: #000
    border: none

</style>