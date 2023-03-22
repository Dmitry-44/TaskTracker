<script lang="ts" setup>
import { usePipeStore } from "@/stores/pipe";
import type { Pipe } from "@/types/pipe";
import type { FilterPayload } from "@/types/index";
import { ref, computed, onBeforeMount, type Ref } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
import { pipeService } from "@/services/pipe";
import { ElMessage } from "element-plus";
import { isSuccessApiResponse } from "@/types/api";
import { errVueHandler } from "@/plugins/errorResponser";

const router = useRouter();
const paramId = router.currentRoute.value.params["id"];
const pipeStore = usePipeStore();
// const pipe = computed<Pipe | null>(() => pipeStore.getSinglePipe);
const LOADING = ref(false);

let pipe: Ref<Pipe|null> = ref(null)
const loading =true
onBeforeMount(async () => {
  const payload: FilterPayload = {
    select: [],
    filter: { id: paramId },
    options: { onlyLimit: true, itemsPerPage: 1 },
  };

  pipeService.fetchPipes(payload)
		.then(respdata => {
			LOADING.value = true;
			if (isSuccessApiResponse(respdata)) {
				const res = respdata.result as Pipe[]
				pipe.value =
					res.length > 0
					? res[0]
					: null;
				return true;
			} else {
				return respdata.message || -1;
			}
  		})
		.then(res=>{
			if (!errVueHandler(res)) {
				ElMessage({
					message: "Данные не найдены!",
					type: "error",
					center: true,
					duration: 1500,
					showClose: true,
				});
			}
		})
		.catch((e) => {errVueHandler(e)})
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
