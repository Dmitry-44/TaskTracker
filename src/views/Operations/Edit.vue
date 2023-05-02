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

const fetchOperationById = () => {
  const payload: FilterPayload = {
    select: [],
    filter: { id: paramId },
    options: { onlyLimit: true, itemsPerPage: 1 },
  };
  return OperationService.fetchOperations(payload);
};
onBeforeMount(async () => {
  LOADING.value = true;
  await fetchOperationById();
  LOADING.value = false;
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
      :loading="LOADING"
      :key="operation?.id"
    />
  </el-skeleton>
</template>
