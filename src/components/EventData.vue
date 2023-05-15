<script setup lang="ts">
import { eventStatusOptions, type Event } from '@/entities/event';
import { taskDateFormat, type TaskEvent } from '@/entities/task';
import type { PropType } from 'vue';


const props = defineProps({
    event: {
        type: Object as PropType<TaskEvent>,
        required: true
    }
})

const eventStatus = eventStatusOptions.find((ev) => props.event?.status === ev['id']);

</script>

<template>
    <div class="row" v-if="event?.status">
      <div class="left">Статус</div>
      <div class="right">
        <el-tag class="tag-info" :color="eventStatus?.['color']">{{ eventStatus?.['value'] }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.created">
      <div class="left">Старт</div>
      <div class="right">
        <el-tag class="tag-info">{{ taskDateFormat(event.created) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.modified">
      <div class="left">Изменено</div>
      <div class="right">
        <el-tag class="tag-info">{{ taskDateFormat(event.modified) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.finished">
      <div class="left">Закончена</div>
      <div class="right">
        <el-tag class="tag-info">{{ taskDateFormat(event.finished) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.userName">
      <div class="left">Исполнитель</div>
      <div class="right">
        <el-tag class="tag-info">{{ event.userName }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.result">
      <div class="left">Результат</div>
      <div class="right">
        {{ event.result['text']||'-' }}
      </div>
    </div>
</template>