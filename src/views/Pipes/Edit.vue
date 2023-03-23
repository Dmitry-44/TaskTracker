<script lang="ts" setup>
import { usePipeStore } from "@/stores/pipe";
import type { Pipe } from "@/types/pipe";
import type { FilterPayload } from "@/types/index";
import { ref, computed, onBeforeMount, type Ref } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/PipeCard.vue";
import { pipeService } from "@/services/index";

const router = useRouter();
const paramId = router.currentRoute.value.params["id"];
const pipeStore = usePipeStore();
const pipe = computed<Pipe | null>(() => pipeStore.getSinglePipe);
const LOADING = ref(false);


onBeforeMount(async () => {
	const payload: FilterPayload = {
		select: [],
		filter: { id: paramId },
		options: { onlyLimit: true, itemsPerPage: 1 },
	};
	LOADING.value = false
	pipeService
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
    <PipeCard v-if="pipe" :pipe="pipe" :loading="LOADING" :key="pipe?.id" />
  </el-skeleton>
</template>
