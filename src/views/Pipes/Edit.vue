<script lang="ts" setup>
import { useTaskStore, type FilterPayload, type ResultWithMessage } from "@/stores/task";
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import PipeCard from "../../components/kanban/PipeCard.vue";

const router = useRouter()
const paramId = router.currentRoute.value.params.id
const store = useTaskStore()

let pipe = ref(null)

const fetchPipeById = () => {
    const payload: FilterPayload = {select:[],filter:{'id':paramId}, options:{onlyLimit:true,itemsPerPage:1}}
    return store.fetchPipesList(payload)
}
const fetchOperationsList = () => {
    return store.fetchOperationsList()
}
onBeforeMount(() => {
  fetchPipeById().then(res=> {
        if (
            Object.prototype.hasOwnProperty.call(res, "message") &&
            res.message === "ok"
          ) {
            const [data] = res.result
            // store.setPipeSingle(data);
            pipe.value = data
            return true;
          } else {
            return res.message || -1;
          }
    })
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
    <PipeCard v-if="pipe" :pipeData=pipe />
    <el-table v-else v-loading="true" style="width: 100%"></el-table>
</template>