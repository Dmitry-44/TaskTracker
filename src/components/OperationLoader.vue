<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref, watch, type Component, type PropType } from 'vue';
import operationComponents from '../../operationComponents.json';

const props = defineProps({
    params: {           
      type: Object as PropType<Record<string,any>>,
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
  (e: "update:params", value: Object): void;
}>();

const params = ref(props.params)

const componentNamesList: Record<string, string> = operationComponents

const componentToRender: Component = defineAsyncComponent({
    loader: () => import(`@/components/operations/${componentNamesList[props.id]}.vue`)
});

if(!props.readonly){
    watch(
    ()=> params.value,
    (newParams, oldParams)=>{
        emit('update:params', newParams)
    }
)}


</script>
<template>
    <component :key="id" :is="componentToRender" v-model="params" :readonly="readonly" ></component>
</template>