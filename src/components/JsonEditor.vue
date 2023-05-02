<script setup lang="ts">
import { Checked, EditPen } from "@element-plus/icons-vue";
import { cloneDeep } from "lodash";
import { computed, ref, getCurrentInstance, toRef, type Ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: {},
    required: true,
  }
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Object): void;
}>();


//VARIABLES
const error = ref(false);

const OPTIONS = ref({
      tabSize: 2,
      readonly: true,
      placeholder: "",
      rows: 6,
      width: "100%",
    })
    
const textarea: Ref<HTMLInputElement|null> = ref(null)
const valueString = computed(()=>JSON.stringify(props.modelValue, null, OPTIONS.value["tabSize"]));


//METHODS
const tabHandler = (e: KeyboardEvent) => {
  e.preventDefault();
  document.execCommand(
    "insertText",
    false,
    " ".repeat(OPTIONS.value["tabSize"])
  );
};
const blurHandle = (e: Event) => {
  format()
};
const format = () => {
  const data = cloneDeep(textarea.value?.value)
  if(!data)return;
  const isJSON = isValidJSON(data)
  if(isJSON){
    const newValue = JSON.parse(data);
    emit("update:modelValue", newValue);
    OPTIONS.value.readonly=true
    error.value=false
  } else {
    error.value = true;
  }
};

const isValidJSON = (data: any) => {
  try {
    JSON.parse(data);
  } catch (e) {
    console.log("JSON parse error: ", e);
    return false;
  }
  return true;
};

const edit = () => {
  OPTIONS.value.readonly=false
}

</script>

<template>
  <div
    class="json-editor"
    :style="{ width: OPTIONS['width'] }"
    :class="{ 'error': error }"
  >
    <textarea
      class="textarea"
      :value="valueString"
      :rows="OPTIONS['rows']"
      :disabled="OPTIONS['readonly']"
      :placeholder="OPTIONS['placeholder']"
      @keydown.tab.prevent="tabHandler($event)"
      @blur="blurHandle($event)"
      ref="textarea"
    >
    </textarea>
    <div class="actions_block">
      <el-tooltip
        v-if="OPTIONS['readonly']"
        class="item"
        effect="dark"
        content="Редактировать"
        placement="right-start"
      >
        <el-button :icon="EditPen" @click="edit()" />
      </el-tooltip>
      <el-tooltip
        v-if="!OPTIONS['readonly']"
        class="item"
        effect="dark"
        content="Готово"
        placement="right-start"
      >
        <el-button :icon="Checked" @click="format()" />
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

.json-editor.error .textarea
  border: 2px solid #f56c6c

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
