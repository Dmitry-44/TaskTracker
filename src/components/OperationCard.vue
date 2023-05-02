<script setup lang="ts">
import type { Operation } from "@/entities/operation";
import { computed, type PropType, ref, onMounted, toRef, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import JsonEditor from "@/components/JsonEditor.vue";
import { services } from "@/main";

const props = defineProps({
  operation: {
    type: Object as PropType<Operation>,
    default: () => ({
      name: "",
      params: {},
    }),
  }
});

//VARIABLES
const router = useRouter();
const OperationService = services.Operation
const operation = ref(props.operation);
const oldContent = ref("");

const dataWasChanged = computed(() => {
  const updatedData = JSON.parse(JSON.stringify(operation.value));
  return oldContent.value != JSON.stringify(updatedData);
});
const LOADING = ref(false);

//HOOKS
onBeforeMount(() => {
  oldContent.value = JSON.stringify(operation.value);
});

//METHODS
const sendOperation = async() => {
  LOADING.value = true;
  OperationService
    .sendOperation(operation.value)
    .then(ok => {
      if (ok) {
        if (!operation?.value?.id) router.push("/operations");
        oldContent.value = JSON.stringify(operation.value);
      }
    })
    .finally(()=> {LOADING.value = false})
};
</script>

<template>
  <el-card class="card" v-loading="LOADING">
    <template #header>
      <el-row justify="space-between">
        <h3>Операция</h3>
        <div class="header-actions">
          <el-button type="info" @click="router.push('/operations')"
            >Отмена</el-button
          >
          <el-button
            :disabled="!dataWasChanged"
            type="success"
            @click="sendOperation()"
            >Сохранить</el-button
          >
        </div>
      </el-row>
    </template>
    <div>
      <h4>Заголовок</h4>
      <el-input
        class="card-name mb-4"
        label="Заголовок"
        v-model.trim="operation.name"
        placeholder="Название"
      />
    </div>
    <div>
      <h4>Параметры</h4>
      <JsonEditor v-model="operation.params"/>
    </div>
  </el-card>
</template>

<style lang="sass" scoped>
.card
    width: min(100%, 1200px)
    margin: 20px auto
    &-name
        width: min(100%, 400px)
</style>
