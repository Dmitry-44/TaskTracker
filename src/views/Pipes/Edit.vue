<script lang="ts" setup>
import { services } from "@/main";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/api";
import type { Pipe } from "@/entities/pipe";
import { ref, computed, onBeforeMount, type Ref } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/PipeCard.vue";

const router = useRouter();
const paramId = router.currentRoute.value.params["id"];
const pipeStore = usePipeStore();
const pipe = computed<Pipe | null>(() => pipeStore.getSinglePipe);
const LOADING = ref(false);
const PipeService = services.Pipe


onBeforeMount(async () => {
	const payload: FilterPayload = {
		select: [],
		filter: { id: paramId },
		options: { onlyLimit: true, itemsPerPage: 1 },
	};
	LOADING.value = true
	PipeService
		.fetchPipes(payload)
		.finally(()=>{LOADING.value = false})

});
</script>

<!-- //TO DO -->
<template>
  <el-skeleton style="width: 300px" :loading="LOADING" animated :throttle="500">
    <template #template>
      <el-skeleton-item
        variant="rect"
        style="width: 300px; height: calc(100vh - 230px)"
      />
    </template>
    <PipeCard v-if="pipe" :pipe="pipe" :key="pipe?.id" />
    <el-card v-if="!LOADING&&!pipe">
      <el-row justify="center">Пайплайн не найден</el-row>
    </el-card>
  </el-skeleton>
</template>
