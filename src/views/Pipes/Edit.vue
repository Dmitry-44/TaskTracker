<script lang="ts" setup>
import { type Pipe, useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let pipe = computed<Pipe>(()=>store.getSinglePipe)
let LOADING = ref(false)

const fetchPipeById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return store.fetchPipesList(payload)
}

onBeforeMount(async() => {
  LOADING.value=true
  await fetchPipeById()
  await store.fetchOperationsList()
  LOADING.value=false
});
</script>

<template>
    <PipeCard :pipeData=pipe :loading=LOADING :key=pipe?.id />
</template>