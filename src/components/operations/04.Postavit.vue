<script setup lang="ts">
import { useOperationStore } from '@/stores/operation';
import { computed, ref, watch, type PropType } from 'vue';
import type { Event } from '@/entities/event';
import { useSitesStore } from '@/stores/sites';

const props = defineProps({
    modelValue: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        direction: 0,
        time: null
      })
    },
    params: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        direction: 0,
        time: null
      })
    },
    readonly: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits<{
  (e: "update:params", value: Event['params']): void;
}>();


const params = ref(props.modelValue)
const DIRECTION_OPTIONS = useOperationStore().getDirectionOptions
const SITES_OPTIONS = useSitesStore().getList


const activeSites = computed(()=>SITES_OPTIONS.filter(site=>{
    if(!Array.isArray(params.value!['site_ids'])){
      return false  
    }
    return params.value!['site_ids'].includes(site.id)
}))

const activeDirection = computed(()=>DIRECTION_OPTIONS.find(dir=>dir['id']===params.value!['direction']))

watch(
    ()=> props.modelValue,
    (newValue, oldValue)=>{
        params.value=newValue
    }
)
if(!props.readonly){
    watch(
        ()=> params.value,
        (newParams, oldParams)=>{
            emit('update:params', newParams)
        },
        {deep: true}
    )
}
</script>

<template>
    <div class="row">
        <div class="left">Направление</div>
        <div class="right">
            <el-select
                v-if="!readonly"
                v-model="params!['direction']"
                placeholder="Выбрать направление"
                :disabled="readonly"
            >
            <el-option
                v-for="item in DIRECTION_OPTIONS"
                :key="item['id']"
                :label="item['name']"
                :value="item['id']"
            />
            </el-select>
            <el-tag v-else class="tag-info">{{ activeDirection?.['name'] }}</el-tag>
        </div>
    </div>
    <div class="row">
        <div class="left">На сайты</div>
        <div class="right">
            <el-select
                v-if="!readonly"
                v-model="params!['site_ids']"
                placeholder="Выбрать сайты"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                :disabled="readonly"
            >
            <el-option
                v-for="item in SITES_OPTIONS"
                :key="item['id']"
                :label="item['url']"
                :value="item['id']"
            />
            </el-select>
            <el-tag v-else v-for="site in activeSites" :key="site.id" class="tag-info">{{ site?.['url'] || '-' }}</el-tag>
        </div>
    </div>
</template>

<style>

.modal-take-task-body .row{
    display: flex;
    align-items: baseline;
    margin-top: 5px;
}
.modal-take-task-body .row .left {
    min-width: 100px;
    margin-right: 10px;
}

</style>