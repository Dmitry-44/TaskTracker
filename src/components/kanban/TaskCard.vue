<script setup lang="ts">
import { SuccessFilled, More, EditPen, Pointer } from "@element-plus/icons-vue";
import { ref, onMounted, computed, nextTick } from 'vue'
import type { PropType } from 'vue'
import SelectOptions from "./SelectOptions.vue";
import { useTaskStore, type Task } from "@/stores/task";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    default: () => ({}),
    require: true,
  },
  active: {
      type: Boolean,
      default: () => false
  },
  emptyCard: {
      type: Boolean,
      default: () => false
  },
});

const task = ref(props.task)
const readonlyTask = computed(()=> task.value.status===4)
const priorityOptions = useTaskStore().getPriorityOptions
const statusOptions = useTaskStore().getStatusOptions

const selectMore = ref<any | HTMLInputElement>(null);

const taskTitleEditing=ref(false)
const titleInput=ref<any | HTMLInputElement>(null)
const changeTitle=()=> {
    taskTitleEditing.value=true
    nextTick(() => {
        titleInput.value.focus();
        titleInput.value.select();
    });
}

const taskPriority = computed(() => {
    return priorityOptions.filter(v=>v.id===task.value.priority)[0]
})
const taskStatus = computed(() => {
    return statusOptions.filter(v=>v.id===task.value.status)[0]
})

const doubleTask=()=> {
    console.log('double task')
}
const deleteTask=()=> {
    console.log('delete task')
}

onMounted(()=> {
    if(props.emptyCard)changeTitle()
})


</script>
<template>
    <div :class="['card', active?'active':'', readonlyTask?'done':'']">
        <div class="content">
            <div class="title-indicator">
                <span class="title">
                    <form v-if="taskTitleEditing">
                        <input 
                        v-model="task.title"
                        class="title-input" 
                        type="text"
                        placeholder="Напишите название задачи"
                        ref="titleInput"
                        @keydown.enter="taskTitleEditing=false"
                        @blur="taskTitleEditing=false"
                        >
                    </form>
                    <span v-else>{{task.title}}</span>
                </span>
                <!-- <el-tooltip class="item" effect="dark" :content="task.status===4 ? 'Задача не завершена' : 'Задача завершена'" placement="top-start">
                    <div class="indicator" @click.stop="task.status=4">
                        <el-icon :color="task.status===4 ? '#67C23A' : ''">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                </el-tooltip> -->
            </div>
            <div class="tags">
                <div class="wrapper" v-if="task.priority">
                    <el-tooltip class="item" effect="dark" :content="`Приоритет: ${taskPriority.value}`" placement="top-start">
                        <el-tag :color="taskPriority.color">{{taskPriority.value}}</el-tag>
                    </el-tooltip>
                </div>
                <div class="wrapper" v-if="task.status">
                    <el-tooltip class="item" effect="dark" :content="`Статус: ${taskStatus.value}`" placement="top-start">
                        <el-tag :color="taskStatus.color">{{taskStatus.value}}</el-tag>
                    </el-tooltip>
                </div>
            </div>
            <div class="actions">
                <div class="buttons">
                    <el-tooltip v-if="!readonlyTask" class="item" effect="dark" content="Взять задачу" placement="top-start">
                        <el-button :icon="Pointer" @click.stop="$emit('take',task.id)"></el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div v-if="!taskTitleEditing" class="menu">
            <el-button type="info" plain :icon="More" @click.stop="selectMore.toggleMenu()"></el-button>
            <el-select class="select-more" ref="selectMore">
                <SelectOptions 
                :task="task"
                @titleChanged="changeTitle()"
                 />
            </el-select>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.card
    border: 1px solid #edeae9
    border-radius: 8px
    height: 150px
    width: 100%
    background-color: #fff
    overflow: hidden
    position: relative
    overflow: hidden
    // width: 280px
    cursor: pointer
    margin-bottom: 8px
    transition-duration: 200ms
    transition-property: background,border-color,box-shadow
    &:hover
        border-color: #afabac
    &.done .content
        opacity: .4 
    &.active
        background: #f1f2fc
        border-color: #406ac4
    & .title-indicator
        line-height: 22px
        max-height: 110px
        margin: 12px 16px 12px 16px
        min-height: 20px
        overflow-x: hidden
        overflow-y: auto
        position: relative
        & .title
            // text-indent: 24px
            display: block
            overflow-wrap: break-word
            font-size: 14px
        & .indicator
            align-items: center
            display: flex
            flex-direction: row
            height: 20px
            left: 0
            overflow: hidden
            position: absolute
            top: 0
            cursor: pointer
            &:hover
                opacity: .7
.card .menu
    margin: 8px
    position: absolute
    right: 0
    top: 0
    display: initial

.select-more
    appearance: none
    position: absolute
    width: 1px
    height: 1px
    visibility: hidden

.card .content
    height: 100%
    display: flex
    flex-direction: column
    justify-content: space-between
.title-input
    width: calc(100% - 25px)
    border: none
    font-size: inherit
    padding: 0
    line-height: inherit
    background-color: inherit
    font-family: inherit
    &:active,&:focus-visible
        border: none
        outline: none

.card .tags
    margin: 0 16px
    display: flex
    flex-flow: wrap
    margin-bottom: -8px
    .wrapper
        margin-bottom: 8px
        margin-right: 8px
        max-width: 100%
.el-tag
    color: #000
    border: none
.card .actions
    align-items: center
    display: flex
    flex-direction: row
    margin: 12px 8px 8px 16px
    .buttons
        align-items: center
        display: flex
        flex: 1
        flex-direction: row
        flex-shrink: 1
        justify-content: flex-end


</style>