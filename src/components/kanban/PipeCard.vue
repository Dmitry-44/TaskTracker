<script setup lang="ts">
import { useTaskStore, type Pipe } from "@/stores/task";
import { computed, type PropType } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";

const props = defineProps({
    pipe: {
        type: Object as PropType<Pipe>,
        default: () => ({}),
    }
})

const store = useTaskStore()
const operations = computed(()=>store.getOperations)

const data = [
    {label: 'написать', id: 1},
    {label: 'проверить', id: 2},
]

</script>
<template>
      <el-card class="card">
        <template #header>
            <div class="card-header">
                <h3>Пайплайн</h3>
            </div>
        </template>
        <el-row>
            <el-col :xl="12">
                <el-input class="card-name" v-model="pipe.name" placeholder="Название" />
                <h5>пайп</h5>
                <el-tree
                    :data="data"
                    draggable
                    default-expand-all
                    node-key="id"
                />
            </el-col>
            <el-col :xl="12">
                <el-collapse class="collapse">
                    <el-collapse-item title="Операции">
                        <el-table class="table" :data="operations" size="large" border="true">
                            <el-table-column label="Название" prop="name">
                            </el-table-column>
                            <el-table-column label="Действия">
                            <template #default="scope">
                                <el-tooltip class="item" effect="dark" content="Добавить" placement="top-start">
                                    <el-button size="large" :icon="CirclePlus" @click="handleEdit(scope.row.id)"></el-button>
                                </el-tooltip>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
        
        
    </el-card>
</template>

<style lang="sass" scoped>
.card
    width: min(100%, 1200px)
    margin: 20px auto
    &-name 
        width: min(100%, 400px)
.collapse
    width: min(100%, 400px)
</style>