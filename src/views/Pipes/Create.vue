<script lang="ts" setup>
import { useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const store = useTaskStore()

onBeforeMount(() => {
  store.fetchOperationsList()
});
</script>

<template>
    <PipeCard />
</template>