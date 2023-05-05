<script setup lang="ts">

import { useTaskStore } from '@/stores/task'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { computed, onBeforeMount, ref, shallowRef, watch, type Component, type Ref, type ShallowRef } from 'vue';
import { services } from '@/main';
import { lastFromArray } from '@/plugins/utils';
import { useOperationStore } from '@/stores/operation';
import { operationLoader } from '@/plugins/operationLoader';
import OperationLoader from './OperationLoader.vue';


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

// const operationComponent: ShallowRef<Component|null> = shallowRef(null);

// watch(
// 	()=>taskLastEventOperation.value,
// 	async(newValue, oldValue)=>{
// 		if(!newValue)return;
// 		if(!newValue.id)return;
// 		operationComponent.value= await operationLoader(newValue!.id)
// 	}
// )

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
			<!-- <component :key="task?.id" v-if="operationComponent" :is="operationComponent" v-bind="{readonly: true, params: taskLastEvent?.params}" ></component> -->
			<OperationLoader v-if="taskLastEvent" :key="task?.id" :params="taskLastEvent?.params" :readonly="true" :id="taskLastEventOperation!.id"></OperationLoader>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogCancelHandle">Отмена</el-button>
				<el-button type="primary" @click="dialogOkHandle">Взять</el-button>
			</span>
		</template>
	</el-dialog>
</template>