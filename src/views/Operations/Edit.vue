<script lang="ts" setup>
import { useOperationStore, type Operation } from "@/stores/operation";
import type { FilterPayload } from "@/stores/task";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import OperationCard from "../../components/kanban/OperationCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const operationStore = useOperationStore()

let operation = computed<Operation|null>(()=>operationStore.getSingleOperation)
let LOADING = ref(false)

const fetchOperationById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return operationStore.fetchOperations(payload)
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