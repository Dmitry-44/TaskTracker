<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import Menu from "@/components/MenuAside.vue";
import Io from "@/plugins/io";
const isCollapse = ref(true);
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const userInfo = computed(() => UserStore.getUser);
const logout = () => UserStore.logout();
onBeforeMount(() => {
  const query = Object.assign({}, route.query);
  delete query.auth;
  router.replace({ query });
});
const loader = computed(() => UserStore.getLoader);
</script>

<template>
  <div class="common-layout" v-loading="loader">
    <el-container>
      <el-header class="navbar">
        <el-container class="toolbar first">
          <div
            class="hidden-xs-only"
            style="display: flex; align-items: center"
          >
            <el-button
              class="hidden-sm-and-down"
              type="primary"
              circle
              @click="isCollapse = !isCollapse"
            >
              <el-icon>
                <Expand />
              </el-icon>
            </el-button>
            <el-image src="/favicon.png" class="ml-2 logo-image" />
            <span class="logo-text">Таск-трекер</span>
          </div>
          <div class="hidden-md-and-up menu-block-mobile">
            <Menu
              class="menu-element-mobile"
              :is-collapse="isCollapse"
              :is-horizontal="true"
            />
          </div>
          <div>
            <span class="hidden-xs-only">{{ userInfo?.fio }}</span>
            <span class="hidden-md-and-up">{{
              userInfo?.fio?.split(" ")[0]
            }}</span>
            <el-icon
              class="user-block"
              @click="logout"
              style="margin-left: 8px"
            >
              <SwitchButton />
            </el-icon>
          </div>
        </el-container>
      </el-header>
      <el-container>
        <el-aside class="hidden-sm-and-down">
          <Menu :is-collapse="isCollapse" />
        </el-aside>
        <el-container>
          <el-main class="content">
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
