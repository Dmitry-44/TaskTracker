<script setup lang="ts">
import { Plus, Edit } from "@element-plus/icons-vue";
import { useOperationStore } from "@/stores/operation";
import { usePipeStore } from "@/stores/pipe";
import { useRouter } from "vue-router";
import { ref, computed, onBeforeMount } from "vue";
import { services } from "@/main";

const router = useRouter();
const pipeStore = usePipeStore();
const operationStore = useOperationStore();

const pipes = computed(() => pipeStore.getPipes);
const operations = computed(() => operationStore.getOperations);

const handleEdit = (id: number) => {
  router.push(`/pipes/${id}`);
};
const loading = ref(false)

onBeforeMount(()=>{
  loading.value=true
  services.Pipe.fetchPipes()
                .finally(()=>{loading.value=false})
})

</script>

<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <span class="title">Пайплайны</span>
        <el-button
          type="primary"
          style="margin-left: auto"
          :icon="Edit"
          @click="router.push(`/pipes/create`)"
          >Создать</el-button
        >
      </div>
    </template>
    <el-table class="table" :data="pipes" size="large" :border="true" v-loading="loading">
      <el-table-column label="Название" prop="name" width="180">
      </el-table-column>
      <el-table-column label="Операции">
        <template #default="scope">
          <el-tag v-for="id in scope.row.value" style="margin: 5px">
            {{ operations.filter((op) => op?.id === id)[0]?.name }}
          </el-tag>
        </template>
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
