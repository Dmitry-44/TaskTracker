import { defineStore } from "pinia";

type State = {
  detailWindowIsOpen: boolean;
  isCreatingTaskProcess: boolean;
  globalLoading: boolean;
};

export const useInterfaceStore = defineStore({
  id: "interface",
  state: (): State => ({
    detailWindowIsOpen: false,
    isCreatingTaskProcess: false,
    globalLoading: false
  }),
  getters: {
    getIsCreatingTaskProcess: (state) => state.isCreatingTaskProcess,
    getDetailWindowIsOpen: (state) => state.detailWindowIsOpen,
    getGlobalLoading: (state) => state.globalLoading
  },
  actions: {
    toggleDetailsWindow(bool: boolean): void {
      this.detailWindowIsOpen = bool;
    },
    toggleCreatingTaskProcess(bool: boolean): void {
      this.isCreatingTaskProcess = bool;
    },
    toggleGlobalLoading(bool: boolean): void {
      this.globalLoading=bool
    }
  },
});
