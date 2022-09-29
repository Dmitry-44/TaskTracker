<script lang="ts" setup>
import { type Pipe, useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let pipe = computed<Pipe>(()=>store.getSinglePipe)

const fetchPipeById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return store.fetchPipesList(payload)
}

onBeforeMount(() => {
  fetchPipeById()
  store.fetchOperationsList()
});
</script>

<template>
    <PipeCard v-if="pipe" :pipeData=pipe />
    <el-table v-else v-loading="true" style="width: 100%"></el-table>
</template>