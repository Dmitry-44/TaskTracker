<script setup lang="ts">
import { useOperationStore } from "@/stores/operation";
import { Plus, Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ref, computed, onBeforeMount } from "vue";

const router = useRouter();
const operationStore = useOperationStore();

const operations = computed(() => operationStore.getOperations);

const handleEdit = (id: number) => {
  router.push(`/operations/${id}`);
};
</script>
<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <span class="title">Операции</span>
        <el-button
          type="primary"
          style="margin-left: auto"
          :icon="Edit"
          @click="router.push(`/operations/create`)"
          >Создать</el-button
        >
      </div>
    </template>
    <el-table class="table" :data="operations" size="large" :border="true">
      <el-table-column label="Название" prop="name" width="auto">
      </el-table-column>
      <el-table-column label="Действия" width="120px">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.id)"
            >Изменить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style lang="sass" scoped>
.card
    margin: 20px
.card-header
    display: flex
    justify-content: space-between
    align-items: baseline
    width: min(100%, 1200px)
    margin: 0 auto
    .title
        font-weight: 600
        letter-spacing: .5px

.table
    width: min(100%, 1200px)
    margin: 0 auto
</style>
