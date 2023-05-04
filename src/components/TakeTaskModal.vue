<script setup lang="ts">

import { useTaskStore } from '@/stores/task'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue';
import { services } from '@/main';
import { lastFromArray } from '@/plugins/utils';
import { useOperationStore } from '@/stores/operation';
import OperationParamsGenerator from "./OperationParamsGenerator.vue";
import OperationLoader from "@/components/OperationLoader.vue";


const taskStore = useTaskStore()
const task = computed(()=> taskStore.getTaskToTake)
const taskLastEvent = computed(()=> lastFromArray(task.value?.event_entities!))
const taskLastEventOperation = computed(()=>useOperationStore().getOperations.find(oper=>oper.id===taskLastEvent.value?.operation_id))
const commonStore = useCommonStore()
const showModal = computed(()=> commonStore.getShowTakeTaskModal)
const user = useUserStore().getUser
const TaskService = services.Task


//METHODS
function dialogCancelHandle(){
	commonStore.hideTakeTaskModal()
	taskStore.setTaskToTake(null)
}

function dialogOkHandle(){
	TaskService.takeTask(task.value!, user)
	commonStore.hideTakeTaskModal()
}

</script>

<template>
	<el-dialog v-model="showModal" width="30%" @close="dialogCancelHandle">
		<template #header>
			<el-row justify="center">
				<span class="modal__title">Уверены что хотите взять задачу?</span>
			</el-row>
		</template>
		<el-row class="modal__task__title mb-2">
			<span><b>{{ taskLastEventOperation?.name }}:</b></span><br/>
			<span>"{{ task?.title }}"</span>
		</el-row>
			<OperationLoader v-if="taskLastEventOperation" key="modal" :id="taskLastEventOperation.id" :readonly="true" :params="taskLastEvent?.params"/>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogCancelHandle">Отмена</el-button>
				<el-button type="primary" @click="dialogOkHandle">Взять</el-button>
			</span>
		</template>
	</el-dialog>
</template>