<script lang="ts" setup>
import { useTaskStore } from "@/stores/task";
import { computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()
const pipe = computed(() => store.getPipeById(Number(paramId))) 

const fetchPipesList = () => {
    store.fetchPipesList()
}
const fetchOperationsList = () => {
    store.fetchOperationsList()
}

onBeforeMount(() => {
    fetchPipesList()
    fetchOperationsList()
});

</script>

<template>
    <PipeCard :pipe=pipe />
</template>