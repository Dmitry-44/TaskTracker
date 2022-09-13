<script lang="ts" setup>
import { useTaskStore, type FilterPayload } from "@/stores/task";
import { computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let pipe = computed(() => store.getPipeSingle)
console.log('pipe', pipe.value)

const fetchPipeById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    store.fetchPipeById(payload)
}
const fetchOperationsList = () => {
    store.fetchOperationsList()
}

onBeforeMount(() => {
    fetchPipeById()
    fetchOperationsList()
});

</script>

<template>
    <PipeCard :pipe=pipe />
</template>