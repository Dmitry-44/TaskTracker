<script lang="ts" setup>
import { type Operation, useTaskStore, type FilterPayload } from "@/stores/task";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
import OperationCard from "../../components/kanban/OperationCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let operation = computed<Operation>(()=>store.getSingleOperation)
let LOADING = ref(false)

const fetchOperationById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return store.fetchOperationsList(payload)
}
onBeforeMount(async() => {
    LOADING.value=true
    await fetchOperationById()
    LOADING.value=false
});
</script>

<template>
    <OperationCard :operationData=operation :loading=LOADING :key=operation?.id />
</template>