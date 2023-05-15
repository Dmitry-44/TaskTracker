<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useTaskStore } from "@/stores/task";
import { useCommonStore } from "@/stores/common";
import { Close, Pointer, Finished, ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue";
import type { PropType} from "vue";
import { services } from "@/main";
import type { Task, TaskEvent } from "@/entities/task"

const props = defineProps({
  task: {
    type: Object as PropType<TaskEvent>,
    required: true
  },
  dataWasChanged: {
    type: Boolean,
    default: false
  },
  canTakeTask: {
    type: Boolean,
    required: true
  },
  canTakeTaskToProgress: {
    type: Boolean,
    required: true
  },
  canReturnTaskToBacklog: {
    type: Boolean,
    required: true
  },
  canFinishTask: {
    type: Boolean,
    required: true
  },
  CREATE_MODE: {
    type: Boolean,
    required: true
  },
  READ_MODE: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits<{
  (e: "save"): void;
  (e: "finish"): void;
}>();


const userStore = useUserStore();
const taskStore = useTaskStore();
const commonStore = useCommonStore();
const user = userStore.getUser;
const TaskService = services.Task

const takeTask = () => {
    taskStore.setTaskToTake(Object.assign({}, props.task))
    commonStore.openTakeTaskModal()
}

</script>

<template>
  <el-button
    v-if="!READ_MODE"
    :disabled="!dataWasChanged"
    type="success"
    @click="emit('save')"
    >Сохранить</el-button
  >
  <el-button
    v-show="CREATE_MODE"
    type="info"
    @click="TaskService.clearTask()"
    >Очистить</el-button
  >
  <template v-if="READ_MODE">
    <el-tooltip
      v-if="canTakeTask"
      class="item"
      effect="dark"
      content="Взять задачу"
      placement="top-start"
    >
      <el-button 
      :icon="Pointer"
      @click.stop="takeTask"
      ></el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canTakeTaskToProgress"
      class="item"
      effect="dark"
      content="В работу"
      placement="top-start"
    >
      <el-button
        :icon="ArrowRightBold"
        @click.stop="TaskService.takeTaskToProgress(task, user)"
      ></el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canReturnTaskToBacklog"
      class="item"
      effect="dark"
      content="Вернуть к исполнению"
      placement="top-start"
    >
      <el-button
        :icon="ArrowLeftBold"
        @click.stop="TaskService.returnTaskToBacklog(task, user)"
      ></el-button>
    </el-tooltip>
    <el-tooltip
      v-if="canFinishTask"
      class="item"
      effect="dark"
      content="Завершить задачу"
      placement="top-start"
    >
      <el-button 
        :icon="Finished"
        @click.stop="emit('finish')"
      >
      </el-button>
    </el-tooltip>
  </template>
  <el-tooltip
    class="item"
    effect="dark"
    content="Закрыть"
    placement="top-start"
  >
    <el-button
      class="close-btn"
      :icon="Close"
      @click.stop="TaskService.closeDetailWindow()"
    ></el-button>
  </el-tooltip>
</template>