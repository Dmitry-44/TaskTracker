<script setup lang="ts">
import { eventStatusOptions, type Event } from '@/entities/event';
import { taskDateFormat } from '@/entities/task';
import type { PropType } from 'vue';


const props = defineProps({
    event: {
        type: Object as PropType<Event>,
        required: true
    }
})

const eventStatus = eventStatusOptions.find((ev) => props.event?.status === ev['id']);

</script>

<template>
    <div class="row" v-if="event?.status">
      <div class="left">Статус</div>
      <div class="right">
        <el-tag class="status-tag" :color="eventStatus?.['color']">{{ eventStatus?.['value'] }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.created">
      <div class="left">Старт</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.created) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.modified">
      <div class="left">Изменено</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.modified) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.finished">
      <div class="left">Закончена</div>
      <div class="right">
        <el-tag>{{ taskDateFormat(event.finished) }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.user_name">
      <div class="left">Исполнитель</div>
      <div class="right">
        <el-tag>{{ event.user_name }}</el-tag>
      </div>
    </div>
    <div class="row" v-if="event?.result">
      <div class="left">Результат</div>
      <div class="right">
        {{ event.result['text']||'-' }}
      </div>
    </div>
</template>