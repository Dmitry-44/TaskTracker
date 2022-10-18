<script setup lang="ts">
import { Checked } from '@element-plus/icons-vue';
import { computed, ref, getCurrentInstance } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: {},
        required: true
    },
    options: {
        type: Object,
        default: {
            tabSize: 2,
            readonly: false,
            placeholder: '',
            rows: 6,
            width: '100%'
        }
    }
})

const emit = defineEmits<{
    (e: 'update', value: Object): void
}>()

//VARIABLES
let value = ref(props.data)
let OPTIONS = ref(props.options)
let valueString = ref(JSON.stringify(value.value, null, OPTIONS.value.tabSize))

//METHODS
const tabHandler = (e: KeyboardEvent) => {
    e.preventDefault();
    document.execCommand('insertText', false, ' '.repeat(OPTIONS.value.tabSize));
}
const inputHandle = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    value.value=JSON.parse(target.value)
    emit('update', value.value)
}
const format = () => {
    valueString.value=JSON.stringify(JSON.parse(JSON.stringify(value.value)), null, OPTIONS.value.tabSize)
}
// const isJsonData = (data: any) => {
//     try {
//         JSON.parse(data);
//     } catch (e) {
//         console.log('error parse', e)
//         return false;
//     }
//     return true;
// }

const getValue = () => {
    return value.value
}
const getValueJson = () => {
    return JSON.stringify(value.value)
}

defineExpose({
    getValue,
    getValueJson,
    format
})

</script>

<template>
    <div class="json-editor" :style="{'width':OPTIONS.width}">
        <textarea 
        class="textarea"
        :value="valueString" 
        :rows="OPTIONS.rows" 
        :readonly="OPTIONS.readonly"
        :placeholder="OPTIONS.placeholder"
        @keydown.tab.prevent="tabHandler($event)" 
        @input="inputHandle($event)"
        >
        </textarea>
        <div class="actions_block">
            <el-tooltip class="item" effect="dark" content="Отформатировать" placement="right-start">
                <el-button :icon="Checked" @click="format()"/>
            </el-tooltip>
        </div>
    </div>
</template>

<style lang="sass" scope>
.json-editor
    position: relative
    width: auto

.textarea
    width: calc( 100% - 20px)
    padding-top: 45px

.actions_block
    position: absolute
    left: 2px
    top: 2px
    opacity: .4

.actions_block:hover
    opacity: 1

.error-msg
    color: #F56C6C
</style>