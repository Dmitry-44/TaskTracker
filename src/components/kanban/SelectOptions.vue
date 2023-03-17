<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import type { Task } from "@/types/task";
import { useInterfaceStore} from "@/stores/interface";
import { SuccessFilled, More, EditPen, CopyDocument, Delete, Notification, Link, View, Pointer} from "@element-plus/icons-vue";
import { ref, onMounted, computed } from 'vue'
import type { PropType } from 'vue'
import { useRouter } from "vue-router";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    default: () => ({
        id: -1000,
        title: 'Создание новой задачи',
        done: false
    }),
    require: true,
  }
});
const emit = defineEmits(["titleChanged"]);
const task = ref(props.task)
const readonlyTask = computed(()=> task.value.status===4)
const store = useTaskStore()
const interfaceStore = useInterfaceStore()
const toggleDetailsWindow = interfaceStore.toggleDetailsWindow
const router = useRouter()
const setActiveTask = store.setActiveTask
const openInNewTab = () => {
    let routeData = router.resolve({path: `/tasks/${task.value.id}`})
    window.open(routeData.href, '_blank');
}

const copyTaskLink = () => {
    let routeData = router.resolve({path: `/tasks/${task.value.id}`})
    console.log('routeData',routeData)
    navigator.clipboard.writeText(`aaaa`)
            .catch((err) => {
                console.log(err)
            });
}

</script>
<template>
    <el-option value="" @click="openInNewTab()">
        <el-icon><Notification /></el-icon>
        <span style="margin-left:10px;">Открыть в новой вкладке</span>
    </el-option>
    <el-option v-if="!readonlyTask" value="">
        <el-icon><Pointer /></el-icon>
        <span style="margin-left:10px;">Взять задачу</span>
    </el-option>
    <el-option v-if="!readonlyTask" value="" @click="emit('titleChanged')">
        <el-icon><EditPen /></el-icon>
        <span style="margin-left:10px;">Изменить название задачи</span>
    </el-option>
    <el-option value="" @click="setActiveTask(task),toggleDetailsWindow(true)">
        <el-icon><View /></el-icon>
        <span style="margin-left:10px;">Открыть сведения</span>
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

<style lang="sass" scoped>
  
</style>