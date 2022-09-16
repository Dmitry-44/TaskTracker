<script lang="ts" setup>
import { useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const store = useTaskStore()
const fetchOperationsList = () => {
    return store.fetchOperationsList()
}
onBeforeMount(() => {
    fetchOperationsList().then(res=> {
      if (
          Object.prototype.hasOwnProperty.call(res, "message") &&
          res.message === "ok"
        ) {
          res.result
          store.setOperationsList(res.result)
          return true;
        } else {
          return res.message || -1;
        }
    })
});
</script>

<template>
    <PipeCard />
</template>