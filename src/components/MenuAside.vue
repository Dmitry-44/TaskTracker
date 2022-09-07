<script setup lang="ts">
import { Folder, FolderDelete, Menu, DataAnalysis } from "@element-plus/icons-vue";
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
        <Folder />
      </el-icon>
      <template #title>Фотографии</template>
    </el-menu-item>
    <el-menu-item index="/kanban">
      <el-icon>
        <DataAnalysis />
      </el-icon>
      <template #title>Доска</template>
    </el-menu-item>
  </el-menu>
</template>
