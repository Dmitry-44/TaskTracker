<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { useSitesStore } from "@/stores/sites";
import type { FilterPayload } from "@/types/index";
import { Close } from "@element-plus/icons-vue";
import { ref, computed, watch, nextTick, onMounted, onBeforeMount, type Ref } from "vue";
import { searchFiltersService } from "@/services/index";

const emit = defineEmits<{
  (e: "update", value: FilterPayload): void;
}>();

//CONSTANTS
const sitesStore = useSitesStore();
const taskStore = useTaskStore();
const PRIORITY_OPTIONS = computed(() => taskStore.getPriorityOptions);
const SITES_OPTIONS = computed(() => sitesStore.getList);
// const operationsById = computed(() => operationStore.getOperationsById);
// const DIRECTIONS_OPTIONS = computed(
//   () => operationsById?.value[4]?.params["directionArr"] || []
// );

//VARIABLES
const filterIsOpen = ref(false);
const date = ref(searchFiltersService.date)
const dateInt = computed(() => {
  const dtss = Math.round(new Date(date.value[0]).getTime() / 1000);
  const dtff = Math.round(new Date(date.value[1]).getTime() / 1000);
  return {
    dts: new Date((dtss > dtff ? dtff : dtss) * 1000),
    dtf: new Date(((dtff < dtss ? dtss : dtff) + 86399) * 1000),
  };
});

const filterPayload: Ref<FilterPayload> = ref(
  Object.assign(
  {
    ...searchFiltersService.filtersBase
  },
  {
    filter: {
      dts: dateInt.value.dts,
      dtf: dateInt.value.dtf,
    }
  }
))

watch(
  () => date.value,
  () => {
    filterPayload.value.filter['dts'] = dateInt.value.dts
    filterPayload.value.filter['dtf'] = dateInt.value.dtf
    emit("update", filterPayload.value);
  }
);

//METHODS
const setPersonalFilters = () => searchFiltersService.setPersonalFilters(filterPayload.value)
const getPersonalFilters = () => {
  const personalFilters = searchFiltersService.getPersonalFilters()
  if (!personalFilters) {
    setPersonalFilters();
  } else {
    filterPayload.value.filter['priority'] = personalFilters.filter['priority'];
    filterPayload.value.filter['site_ids'] = personalFilters.filter['site_ids'];
    filterPayload.value.filter['smi_direction'] = personalFilters.filter['smi_direction'];
  }
};
const applyFilters = () => {
  searchFiltersService.applyFilters(filterPayload.value)
  emit("update", filterPayload.value);
  closeFilters();
};
const resetFilters = () => searchFiltersService.resetFilters(filterPayload.value)

const closeFilters = () => {
  filterIsOpen.value = false;
};
const openFilters = () => {
  filterIsOpen.value = true;
};

//HOOKS
onBeforeMount(() => {
  getPersonalFilters();
});
onMounted(() => {
  applyFilters();
});

//DATEPICKER DEFAULT SETTINGS
const shortcuts = [
  {
    text: "Сегодня",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      return [start, end];
    },
  },
  {
    text: "Неделя",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Месяц",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

defineExpose({
  closeFilters,
  openFilters,
  resetFilters,
  applyFilters,
  filterPayload,
});
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
      <el-button type="info" class="mx-4" @click="filterIsOpen = true">
        Фильтры<el-icon class="ml-1"><ArrowDown /></el-icon>
      </el-button>
      <el-card v-if="filterIsOpen" class="box-card filters_card">
        <template #header>
          <div class="my-1">
            <el-tooltip
              class="item"
              effect="dark"
              content="Закрыть"
              placement="top-start"
            >
              <el-button
                class="filters_card-close-btn"
                :icon="Close"
                @click="filterIsOpen = false"
              />
            </el-tooltip>
          </div>
        </template>
        <div class="body">
          <el-input
            v-model="filterPayload.filter['search1']"
            class="my-1"
            placeholder="Поиск по заголовку"
          />
          <el-input
            v-model="filterPayload.filter['search2']"
            class="my-1"
            placeholder="Поиск по описанию"
          />
          <el-select
            v-model="filterPayload.filter['priority']"
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
              <span>{{ item.value }}</span>
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
            v-model="filterPayload.filter['site_ids']"
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
              <span>{{ item.url }}</span>
            </el-option>
          </el-select>
          <div class="my-2">
            <el-button type="success" class="ml-3" @click="applyFilters()"
              >Применить</el-button
            >
            <el-button type="warning" class="ml-3" @click="resetFilters()"
              >Сбросить</el-button
            >
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
