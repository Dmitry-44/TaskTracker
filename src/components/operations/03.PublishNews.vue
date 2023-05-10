<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue';
import { useSitesStore } from '@/stores/sites';
import type { Event } from '@/entities/event';

const props = defineProps({
    modelValue: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        site_id: null,
      })
    },
    readonly: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits<{
  (e: "update:modelValue", value: Event['params']): void;
}>();

const params = ref(props.modelValue)
const SITE_OPTIONS = useSitesStore().getList

const activeSite = computed(()=>SITE_OPTIONS.find(site=>site['id']===params.value!['site_id']))


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
            emit('update:modelValue', newParams)
        }
    )
}
</script>

<template>
     <div class="row">
        <div class="left">На сайт</div>
        <div class="right">
            <el-select
                v-if="!readonly"
                v-model="params!['site_id']"
                placeholder="Выбрать сайт"
            >
            <el-option
                v-for="item in SITE_OPTIONS"
                :key="item['id']"
                :label="item['url']"
                :value="item['id']"
            />
            </el-select>
            <el-tag v-else>{{ activeSite?.['url']||'-' }}</el-tag>
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