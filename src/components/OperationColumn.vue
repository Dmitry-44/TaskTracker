<script setup lang="ts">
import type { Event } from "@/entities/event";
import type { Operation } from "@/entities/operation";
import type { PropType } from "vue";

const props = defineProps({
  operation: {
    type: Object as PropType<Operation>,
    default: () => null,
  },
  event: {
    type: Object as PropType<Event | undefined>,
    default: () => null,
  },
});
</script>
<template>
  <div class="kanban-column">
    <div class="title">
      <h3>{{ operation?.name }}</h3>
    </div>
    <div class="content">
      <div class="row" v-if="event?.status">
        <div class="left">Статус</div>
        <div class="right">
          <template v-if="event?.status === 3">
            <el-tag type="success">Готово</el-tag>
          </template>
          <el-tag v-else-if="event?.status === 2" color="#f8df72"
            >В работе</el-tag
          >
          <el-tag v-else color="#f8df72">Создан</el-tag>
        </div>
      </div>
      <div class="row" v-if="event?.created">
        <div class="left">Старт</div>
        <div class="right">
          <el-tag>{{ new Date(event.created * 1000).toLocaleString() }}</el-tag>
        </div>
      </div>
      <div class="row" v-if="event?.modified">
        <div class="left">Изменено</div>
        <div class="right">
          <el-tag>{{
            new Date(event?.modified * 1000).toLocaleString()
          }}</el-tag>
        </div>
      </div>
      <div class="row" v-if="event?.finished">
        <div class="left">Финиш</div>
        <div class="right">
          <el-tag>{{
            new Date(event?.finished * 1000).toLocaleString()
          }}</el-tag>
        </div>
      </div>
      <div class="row" v-if="event?.user_name">
        <div class="left">Исполнитель</div>
        <div class="right">
          <el-tag>{{ event?.user_name }}</el-tag>
        </div>
      </div>
      <!-- <el-collapse v-if="event?.selected_users.length>0">
                <el-collapse-item title="Выбранные пользователи" v-for="user in event?.selected_users">
                    {{user}}
                </el-collapse-item>
            </el-collapse> -->
    </div>
  </div>
</template>
<style lang="sass">
.el-tag
    color: #000
    border: none
    min-height: 24px
    height: auto

.kanban-column .content
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
</style>
