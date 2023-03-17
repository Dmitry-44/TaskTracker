<script lang="ts" setup>
import { usePipeStore} from "@/stores/pipe";
import type { Pipe } from "@/types/pipe";
import type { FilterPayload } from "@/types/index";
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const router = useRouter()
const paramId = router.currentRoute.value.params['id']
const pipeStore = usePipeStore()

let pipe = computed<Pipe|null>(()=>pipeStore.getSinglePipe)
let LOADING = ref(false)

const fetchPipeById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return pipeStore.fetchPipes(payload)
}

onBeforeMount(async() => {
  LOADING.value=true
  await fetchPipeById()
  LOADING.value=false
});
</script>

<template>
    <PipeCard :pipe=pipe :loading=LOADING :key=pipe?.id />
</template>