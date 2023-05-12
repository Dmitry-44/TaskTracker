<script setup lang="ts">
import type { Event } from '@/entities/event';
import { defineAsyncComponent, onBeforeMount, onMounted, ref, watch, type Component, type PropType } from 'vue';
import operationComponents from '../../operationComponents.json';
import { componentsCache } from '@/plugins/componentsCache'


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

const loadComponent = (): Component => {
    const component = defineAsyncComponent({
        loader: () => import(`@/components/operations/${componentNamesList[props.id]}.vue`).catch(()=>false)
    })
    if(!componentsCache.has(props.id) && component != false){
        componentsCache.set(props.id, component)
    }
    return component
}

const componentToRender: Component = componentsCache.get(props.id) || loadComponent();


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