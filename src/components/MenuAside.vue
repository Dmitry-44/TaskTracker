<script setup lang="ts">
import { Folder, FolderDelete, Menu, DataAnalysis, SetUp, Connection } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
const UserStore = useUserStore();
const route = useRoute();
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
  isHorizontal: {
    type: Boolean,
    default: false,
  },
});
////
const rights = computed(() => UserStore.getRights);
</script>
<template>
  <el-menu
    class="left-menu"
    :collapse="isCollapse"
    :default-active="route.path"
    :router="true"
    :mode="isHorizontal ? 'horizontal' : 'vertical'"
  >
    <el-menu-item index="/">
      <el-icon>
        <DataAnalysis />
      </el-icon>
      <template #title>Задачи</template>
    </el-menu-item>
    <el-menu-item index="/operations">
      <el-icon>
        <SetUp />
      </el-icon>
      <template #title>Операции</template>
    </el-menu-item>
    <el-menu-item index="/pipes">
      <el-icon>
        <Connection />
      </el-icon>
      <template #title>Пайплайны</template>
    </el-menu-item>
  </el-menu>
</template>
