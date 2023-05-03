<script setup lang="ts">
import {
  SetUp,
  Connection,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";


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


</script>
<template>
  <el-menu
    class="left-menu"
    :collapse="isCollapse"
    :default-active="route.path"
    :router="true"
    :mode="isHorizontal ? 'horizontal' : 'vertical'"
  >
    <el-sub-menu index="1">
        <template #title>
          <el-icon><DataAnalysis /></el-icon>
          <span>Задачи</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/">Назначены мне</el-menu-item>
          <el-menu-item index="/my">Созданы мной</el-menu-item>
          <el-menu-item index="/archive">Завершенные</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
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
