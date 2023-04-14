<script lang="ts" setup>
import type { Task } from "@/entities/task";
import { CloseBold } from "@element-plus/icons-vue";
import { ref } from "vue";
import { sortOptions } from "@/services/sortService"

const emit = defineEmits<{
  (e: "changeSort", sort: <T extends Task>(a: T, b: T) => number): void;
  (e: "noSort"): void;
}>();

const SORT_OPTIONS = sortOptions
const activeOption = ref<typeof SORT_OPTIONS[0] | null>(null);

//METHODS
const setActive = (i: number) => {
  activeOption.value = SORT_OPTIONS[i];
  emit("changeSort", activeOption.value.filter);
};
const resetActive = () => {
  activeOption.value = null;
  emit("noSort");
};

defineExpose({
  setActive,
  resetActive,
});
</script>

<template>
  <el-dropdown trigger="click">
    <span v-if="activeOption" class="el-dropdown-link"
      >{{ activeOption.name
      }}<el-icon class="el-icon--right"
        ><component :is="activeOption.icon" /></el-icon
    ></span>
    <span v-else class="el-dropdown-link"
      >Фильтр<el-icon class="el-icon--right"><arrow-down /></el-icon
    ></span>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(option, i) in SORT_OPTIONS" :key="i">
          <el-dropdown-item :icon="option.icon" @click="setActive(i)">{{
            option.name
          }}</el-dropdown-item>
        </template>
        <el-dropdown-item :icon="CloseBold" @click="resetActive()"
          >Сбросить</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
