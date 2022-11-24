<script setup lang="ts">
import { type Event, useTaskStore } from '@/stores/task';
import type{ Operation } from '@/stores/operation';
import type { PropType } from 'vue';


const props = defineProps({
    operation: {
        type: Object as PropType<Operation>,
        default:()=>null
    },
    event: {
        type: Object as PropType<Event|null>,
        default:()=>null
    }
})

const taskStore = useTaskStore()
const eventStatusOptions = taskStore.getEventStatusOptions
const statusColor = eventStatusOptions.filter(ev=>props.event?.status===ev.id)[0].color || ''


</script>
<template>
    <el-collapse-item>
        <template #title>
            <div class="collapse-item-header">
                <el-icon :color="statusColor">
                    <SuccessFilled />
                </el-icon>
                <span class="ml-1">{{operation?.name}}</span>
            </div>
        </template>
        <div class="row" v-if="event?.status">
            <div class="left">Статус</div>
            <div class="right">
                <template v-if="event?.status===3">
                    <el-tag type="success">Готово</el-tag>
                </template>
                <el-tag v-else-if="event?.status===2" color="#f8df72">В работе</el-tag>
                <el-tag v-else color="">Создан</el-tag>
            </div>
        </div>
        <div class="row" v-if="event?.created">
            <div class="left">Старт</div>
            <div class="right">
                <el-tag>{{new Date(event!.created*1000).toLocaleString()}}</el-tag>
            </div>
        </div>
        <div class="row" v-if="event?.finished">
            <div class="left">Финиш</div>
            <div class="right">
                <el-tag>{{new Date(event.finished*1000).toLocaleString()}}</el-tag>
            </div>
        </div>
        <div class="row" v-if="event?.user_name">
            <div class="left">Исполнитель</div>
            <div class="right">
                <el-tag>{{event.user_name}}</el-tag>
            </div>
        </div>
    </el-collapse-item>
</template>
<style lang="sass">
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
.el-tag
    color: #000
    border: none

.el-collapse .row
    margin-bottom: .5rem
</style>