<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { useTaskStore } from "@/stores/task";
import { useRouter } from "vue-router";
import { ref, computed, onBeforeMount } from "vue";

const router = useRouter()
const store = useTaskStore()

const fetchOperationsList = () => {
    store.fetchOperationsList()
}

// const pipes = computed(() => store.getPipes);
const operations = computed(() => store.getOperations);

const handleEdit = (id: number) => {
    router.push(`/operations/${id}`)
}
const handleDelete = (id: number) => {

}

onBeforeMount(() => {
    fetchOperationsList()
});

</script>
<template>
        <el-table class="table" :data="operations" size="large" border="true">
        <el-table-column label="Название" prop="name">
        </el-table-column>
        <el-table-column label="Действия" width="200px">
        <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row.id)"
            >Изменить</el-button
            >
            <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >Удалить</el-button
            >
        </template>
        </el-table-column>
    </el-table>
</template>


<style lang="sass" scoped>
.table
    width: min(100%, 1000px)
    margin: 0 auto

</style>