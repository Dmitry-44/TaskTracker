<script setup lang="ts">
import { emptyTask, type Task } from "@/entities/task";
import { useUserStore } from "@/stores/user";
import {
  EditPen,
  Notification,
  View,
  Pointer,
  Finished,
} from "@element-plus/icons-vue";
import { ref, onMounted, computed } from "vue";
import type { PropType } from "vue";
import { useRouter } from "vue-router";
import TaskRepo from "@/api/task";
import { services } from "@/main";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    default: () => emptyTask,
    require: true,
  },
});

const task = ref(props.task);
const readonlyTask = computed(() => task.value.status === 4);
const TaskService = services.Task
const router = useRouter();
const user = useUserStore().getUser;

// const copyTaskLink = () => {
//   const routeData = router.resolve({ path: `/tasks/${task.value.id}` });
//   console.log("routeData", routeData);
//   navigator.clipboard.writeText(`aaaa`).catch((err) => {
//     console.log(err);
//   });
// };
</script>
<template>
  <el-option value="" @click="TaskService.openTaskInNewTab(task)">
    <el-icon><Notification /></el-icon>
    <span style="margin-left: 10px">Открыть в новой вкладке</span>
  </el-option>
  <!-- <el-option v-if="TaskService.canTakeTask(task, user)" value="">
    <el-icon><Pointer /></el-icon>
    <span style="margin-left: 10px">Взять задачу</span>
  </el-option> -->
  <!-- <el-option v-if="TaskService.canFinishTask(task, user)" value="">
    <el-icon><Finished /></el-icon>
    <span style="margin-left: 10px">Завершить задачу</span>
  </el-option> -->
  <el-option value="" @click="TaskService.clickTask(task)">
    <el-icon><View /></el-icon>
    <span style="margin-left: 10px">Открыть сведения</span>
  </el-option>
  <!-- <el-option @click="copyTaskLink()">
        <el-icon><Link /></el-icon>
        <span style="margin-left:10px;">Копировать ссылку на задачу</span>
    </el-option> -->
  <!-- <el-option @click="$emit('doneChanged')">
        <el-icon><SuccessFilled /></el-icon>
        <span style="margin-left:10px;">{{task.done?'Не выполнено':'Выполнено'}}</span>
    </el-option> -->
  <!-- <el-option @click="$emit('doubleTask')">
        <el-icon><CopyDocument /></el-icon>
        <span style="margin-left:10px;">Дублировать задачу</span>
    </el-option> -->
  <!-- <el-option @click="$emit('deleteTask')">
        <el-icon color="#F56C6C"><Delete /></el-icon>
        <span style="margin-left:10px;color:#F56C6C">Удалить задачу</span>
    </el-option> -->
</template>

<style lang="sass" scoped></style>
