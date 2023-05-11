<script setup lang="ts">
import type { Event } from '@/entities/event';
import { defineAsyncComponent, onBeforeMount, ref, watch, type Component, type PropType } from 'vue';
import operationComponents from '../../operationComponents.json';

const props = defineProps({
    params: {           
      type: Object as PropType<Event['params']>,
      default: () => ({
        direction: 0,
        time: null
      })
    },
    id: {
        type: Number,
        required: true
    },
    readonly: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits<{
  (e: "update:params", value: Event['params']): void;
}>();

const params = ref(props.params)

const componentNamesList: Record<string, string> = operationComponents

const componentToRender: Component = defineAsyncComponent({
    loader: () => import(`@/components/operations/${componentNamesList[props.id]}.vue`)
});

watch(
    ()=> params.value,
    (newParams, oldParams)=>{
        params.value=newParams;
        if(!props.readonly){
            emit('update:params', newParams)
        }
    }
)

</script>

<template>
    <componentToRender v-if="componentToRender" :key="id" v-model="params" :readonly="readonly" ></componentToRender>
</template>