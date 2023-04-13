<script setup lang="ts">

import { useTaskStore } from '@/stores/task'
import { useInterfaceStore } from '@/stores/interface'
import { useUserStore } from '@/stores/user'
import { computed, ref, watch, type Ref } from 'vue';
import { services } from '@/main';


const taskStore = useTaskStore()
const task = computed(()=> taskStore.getTaskToFinish)
const interfaceStore = useInterfaceStore()
const showModal = computed(()=> interfaceStore.getShowFinishTaskModal)
const user = useUserStore().getUser
const TaskService = services.Task
const eventResult: Ref<Record<string, any>> = ref({})
const finishConfirmed = ref(false)
const myTaskEvent = ref(task.value?.event_entities?.find(event=>event.u_id===user.id))

//METHODS
function dialogCancelHandle(){
	taskStore.setTaskToFinish(null)
	interfaceStore.hideFinishTaskModal()
}

function dialogOkHandle(){
	if(!finishConfirmed.value){
		finishConfirmed.value = true
		return;
	}

	TaskService.finishTask(task.value!, user, eventResult.value)
  	interfaceStore.hideFinishTaskModal()
}

watch(
  () => showModal.value,
  (newVal) => {
    if(!newVal){
		finishConfirmed.value=false
	}
  }
);

</script>

<template>
	<el-dialog v-model="showModal" width="30%" @close="dialogCancelHandle">
		<el-row v-show="!finishConfirmed" justify="center">
			Уверены что хотите завершить задачу?
		</el-row>
		<el-row justify="center">
			"{{ task?.title }}"
		</el-row>
		<el-row v-if="finishConfirmed" justify="center">
			<h3>Результат:</h3>
			<el-input
				v-model="eventResult['text']"
				clearable
				:autosize="{ minRows: 2, maxRows: 4 }"
				type="textarea"
				placeholder="Текст результата"
            />
		</el-row>
		<template #footer>
			<span class="dialog-footer">
				<el-button 
					@click="dialogCancelHandle"
				>Отмена
				</el-button>
				<el-button 
					type="primary" 
					@click="dialogOkHandle"
				>
				{{ finishConfirmed ? 'Завершить' : 'OK' }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>