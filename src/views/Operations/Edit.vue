<script lang="ts" setup>
import { useTaskStore, type FilterPayload } from "@/stores/task";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";
import OperationCard from "../../components/kanban/OperationCard.vue";
const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let operation = ref(null)

const fetchOperationById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return store.fetchOperationsList(payload)
}
onBeforeMount(() => {
    fetchOperationById().then(res=> {
      if (
          Object.prototype.hasOwnProperty.call(res, "message") &&
          res.message === "ok"
        ) {
          const [data] = res.result
          operation.value = data
          return true;
        } else {
          return res.message || -1;
        }
    })
});
</script>

<template>
    <OperationCard v-if="operation" :operationData=operation />
    <el-table v-else v-loading="true" style="width: 100%"></el-table>
</template>