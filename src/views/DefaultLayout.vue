<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import Menu from "@/components/MenuAside.vue";
import { useOperationStore, type Operation } from "@/stores/operation";
import { useSitesStore } from "@/stores/sites";
import { usePipeStore } from "@/stores/pipe";

const isCollapse = ref(true);
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const userInfo = computed(() => UserStore.getUser);
const logout = () => UserStore.logout();
const operationsStore = useOperationStore()
const loader = computed(() => UserStore.getLoader);
let loading = ref(false)
onBeforeMount(() => {
  loading.value=true
  const query = Object.assign({}, route.query);
  delete query.auth;
  router.replace({ query });

  const operations = operationsStore.fetchOperations()
  const pipes = usePipeStore().fetchPipes()
  const sites = useSitesStore().fetchSites()
  Promise.allSettled([operations, pipes, sites]).then(() => loading.value=false)
});


</script>

<template>
  <div class="common-layout">
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
          <div
            class="loader_block"
            v-if="loading"
            v-loading="loading" 
            >
          </div>
          <el-main v-else class="content" >
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
