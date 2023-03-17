<script setup lang="ts">
import { useTaskStore } from '@/stores/task';
import { useOperationStore } from '@/stores/operation';
import { useSitesStore } from "@/stores/sites";
import type { FilterPayload } from '@/types/index';
import { Close } from '@element-plus/icons-vue';
import { ref, computed, watch, nextTick, onMounted, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user';


const emit = defineEmits<{
    (e: 'update', value: FilterPayload): void
}>()

//CONSTANTS
const sitesStore = useSitesStore()
const taskStore = useTaskStore()
const operationStore = useOperationStore()
const userStore = useUserStore()
const PRIORITY_OPTIONS = computed(() => taskStore.getPriorityOptions)
const SITES_OPTIONS = computed(() => sitesStore.getList)
const operationsById = computed(()=> operationStore.getOperationsById)
const DIRECTIONS_OPTIONS = computed(() => operationsById?.value[4]?.params['directionArr'] || [])
const filterVersion = computed(()=> taskStore.getFilterVersion)
const user = computed(()=> userStore.getUser)

//VARIABLES
let filterIsOpen = ref(false)
let priority = ref([])
let smi_direction = ref([])
let site_ids = ref([])
let search1 = ref(null)
let search2 = ref(null)

const date = ref([new Date(new Date().getTime() - 86400 * 1000).toLocaleDateString('en-CA'), new Date().toISOString().substr(0, 10)])
let dateInt = computed(()=> {
    let dtss = Math.round(new Date(date.value[0]).getTime() / 1000)
    let dtff = Math.round(new Date(date.value[1]).getTime() / 1000)
    return {
        dts: new Date((dtss > dtff ? dtff : dtss) * 1000),
        dtf: new Date(((dtff < dtss ? dtss : dtff) + 86399) * 1000)
    }
})

let filterPayload = computed(()=>{
    return {
        filter: {
            pipe_id: null,
            priority: priority.value,
            ...dateInt.value,
            smi_direction: smi_direction.value,
            site_ids: site_ids.value, 
            search1: search1.value,
            search2: search2.value,
        },
        options: {
            onlyLimit: true,
            itemsPerPage: 100
        },
        select: []
    }
})

watch(
    () => dateInt,
    () => {
        nextTick(()=> {
            emit('update', filterPayload.value)
        })
    },
    {deep: true}
)

//METHODS
const setPersonalFilters = () => {
    let data = {...filterPayload.value} as Partial<FilterPayload>
    delete data!.filter!['search1']
    delete data!.filter!['search2']
    delete data!.filter!['dts']
    delete data!.filter!['dtf']
    try {
        localStorage.setItem(`tasks_filter_settings_${filterVersion.value}_${user?.value?.id}`, JSON.stringify(data))
    } catch(err){
        console.log(err)
    }
}
const getPersonalFilters = () => {
    let personalFiltersString = localStorage.getItem(`tasks_filter_settings_${filterVersion.value}_${user?.value?.id}`)
    if (!personalFiltersString) {
        setPersonalFilters()
    } else {
        let personalFilters = JSON.parse(personalFiltersString)
        priority.value=personalFilters.filter.priority
        site_ids.value=personalFilters.filter.site_ids
        smi_direction.value=personalFilters.filter.smi_direction
    }
}
const applyFilters = () => {
    if(search1.value===''){
        search1.value=null
    }
    emit('update', filterPayload.value)
    setPersonalFilters()
    closeFilters()
}
const resetFilters = () => {
    search1.value=null
    search2.value=null
    priority.value=[]
    smi_direction.value=[]
    site_ids.value=[] 
}
const closeFilters = () => {
    filterIsOpen.value=false
}
const openFilters = () => {
    filterIsOpen.value=true
}

//HOOKS
onBeforeMount(() => {
    getPersonalFilters()
})
onMounted(()=> {
    applyFilters()
})

//DATEPICKER DEFAULT SETTINGS
const shortcuts = [
    {
    text: 'Сегодня',
    value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        return [start, end]
    },
    },
    {
    text: 'Неделя',
    value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
    },
    },
    {
    text: 'Месяц',
    value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
    },
    },
]

defineExpose({
    closeFilters,
    openFilters,
    resetFilters,
    applyFilters,
    filterPayload
})
</script>

<template>
    <div class="filters_block">
        <el-date-picker
            type="daterange"
            v-model="date"
            unlink-panels
            range-separator="Период"
            start-placeholder="От"
            end-placeholder="До"
            :shortcuts="shortcuts"
        />
        <div class="dropdown">
            <el-button type="info" class="mx-4" @click="filterIsOpen=true">
            Фильтры<el-icon class="ml-1"><ArrowDown /></el-icon>
            </el-button>
            <el-card v-if="filterIsOpen" class="box-card filters_card">
                <template #header>
                    <div class="my-1">
                        <el-tooltip class="item" effect="dark" content="Закрыть" placement="top-start">
                            <el-button class="filters_card-close-btn" :icon="Close" @click="filterIsOpen=false"/>
                        </el-tooltip>
                    </div>
                </template>
                <div class="body">
                    <el-input v-model="search1" class="my-1" placeholder="Поиск по заголовку" />
                    <el-input v-model="search2" class="my-1" placeholder="Поиск по описанию" />
                    <el-select 
                    v-model="priority" 
                    multiple 
                    collapse-tags
                    placeholder="Любой приоритет" 
                    class="ml-auto my-1"
                    style="width: 240px"
                    >
                        <el-option
                        v-for="item in PRIORITY_OPTIONS"
                        :key="item.value"
                        :label="item.value"
                        :value="item.id"
                        >
                        <span>{{item.value}}</span>
                        </el-option>
                    </el-select>

                    <!-- <el-select 
                    v-model="smi_direction" 
                    multiple 
                    collapse-tags
                    placeholder="Любое направление" 
                    class="ml-auto my-1"
                    style="width: 240px"
                    >
                        <el-option
                        v-for="item in DIRECTIONS_OPTIONS"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id"
                        >
                        <span>{{item.name}}</span>
                        </el-option>
                    </el-select> -->
                    
                    <!-- Select only for smi center???? -->
                    <el-select 
                    v-model="site_ids" 
                    multiple 
                    collapse-tags
                    placeholder="Все сайты" 
                    class="ml-auto my-1"
                    style="width: 240px"
                    >
                        <el-option
                        v-for="item in SITES_OPTIONS"
                        :key="item.url"
                        :label="item.url"
                        :value="item.id"
                        >
                        <span>{{item.url}}</span>
                        </el-option>
                    </el-select>
                    <div class="my-2">
                        <el-button type="success" class="ml-3" @click="applyFilters()">Применить</el-button>
                        <el-button type="warning" class="ml-3" @click="resetFilters()">Сбросить</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.filters_block
    display: flex
    align-items: center

.filters_block .dropdown
    position: relative

.filters_card
    position: absolute
    top: 50px
    right: 0
    z-index: 50
    &-close-btn
        position: absolute
        right: 5px
        top: 5px
    
</style>