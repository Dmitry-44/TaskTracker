<script lang="ts" setup>
import { useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

const fetchOperationsList = () => {
    store.fetchOperationsList()
}

onBeforeMount(() => {
    fetchOperationsList()
});
</script>

<template>
    <PipeCard />
</template>