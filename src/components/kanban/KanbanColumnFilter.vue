<script lang="ts" setup>
import type { Task } from '@/types/task';
import { CloseBold } from '@element-plus/icons-vue';
import { ref } from 'vue';


const emit = defineEmits<{
  (e: 'changeSort', sort: <T extends Task>(a:T, b:T)=>number): void,
  (e: 'noSort'): void,
}>()

const topPriority = <U extends Task>(a: U, b: U) => a.priority! - b.priority!
const lowPriority = <U extends Task>(a: U, b: U) => b.priority! - a.priority!
const topStatus = <U extends Task>(a: U, b: U) => a.status! - b.status!
const lowStatus = <U extends Task>(a: U, b: U) => b.status! - a.status!

const FILTER_OPTIONS = [
	{
		icon: "Top", name: "Приоритет", filter: topPriority
	},
	{
		icon: "Bottom", name: "Приоритет", filter: lowPriority
	},
	{
		icon: "Top", name: "Статус", filter: topStatus
	},
	{
		icon: "Bottom", name: "Статус", filter: lowStatus
	}
]

const activeOption = ref<typeof FILTER_OPTIONS[0]|null>(null);

//METHODS
const setActive = (i: number) => {
	activeOption.value = FILTER_OPTIONS[i]
	emit("changeSort", FILTER_OPTIONS[i].filter)
}
const resetActive = () => {
	activeOption.value = null
	emit("noSort")
}

const noActivePlaceholder = 'Фильтр'

defineExpose({
	setActive,
	resetActive
})
</script>

<template>
  <el-dropdown trigger="click">
    <span v-if="activeOption" class="el-dropdown-link">{{ activeOption.name }}<el-icon class="el-icon--right"><component :is="activeOption.icon" /></el-icon></span>
    <span v-else class="el-dropdown-link">{{ noActivePlaceholder }}<el-icon class="el-icon--right"><arrow-down /></el-icon></span>
    <template #dropdown>
      <el-dropdown-menu >
		<template v-for="(option, i) in FILTER_OPTIONS" :key="i">
			<el-dropdown-item :icon="option.icon" @click="setActive(i)">{{ option.name }}</el-dropdown-item>
		</template>
        <el-dropdown-item :icon="CloseBold" @click="resetActive()">Сбросить</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>