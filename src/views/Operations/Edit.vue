<script lang="ts" setup>
import { services } from "@/main";
import { useOperationStore } from "@/stores/operation";
import type { FilterPayload } from "@/api";
import type { Operation } from "@/entities/operation";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import OperationCard from "../../components/OperationCard.vue";

const router = useRouter();
const paramId = router.currentRoute.value.params["id"];
const operationStore = useOperationStore();
const OperationService = services.Operation

const operation = computed<Operation | null>(
  () => operationStore.getSingleOperation
);
const LOADING = ref(false);

onBeforeMount(async () => {
  const payload: FilterPayload = {
    select: [],
    filter: { id: paramId },
    options: { onlyLimit: true, itemsPerPage: 1 },
  };
  LOADING.value = true;
  OperationService
    .fetchOperations(payload)
    .finally(()=>{ LOADING.value = false })
});
</script>

<template>

  <el-skeleton style="width: 300px" :loading="LOADING" animated :throttle="500">
    <template #template>
      <el-skeleton-item
        variant="rect"
        style="width: 300px; height: calc(100vh - 230px)"
      />
    </template>
    <OperationCard
      v-if="operation"
      :operation="operation"
      :key="operation?.id"
    />
    <el-card v-if="!LOADING&&!operation">
      <el-row justify="center">Операция не найдена</el-row>
    </el-card>
  </el-skeleton>
</template>
