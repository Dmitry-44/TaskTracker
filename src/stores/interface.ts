import { defineStore } from "pinia";

type State = {
  detailWindowIsOpen: boolean;
  isCreatingTaskProcess: boolean;
};

export const useInterfaceStore = defineStore({
  id: "interface",
  state: (): State => ({
    detailWindowIsOpen: false,
    isCreatingTaskProcess: false,
  }),
  getters: {
    getIsCreatingTaskProcess: (state) => state.isCreatingTaskProcess,
    getDetailWindowIsOpen: (state) => state.detailWindowIsOpen,
  },
  actions: {
    toggleDetailsWindow(bool: boolean): void {
      this.detailWindowIsOpen = bool;
    },
    toggleCreatingTaskProcess(bool: boolean): void {
      this.isCreatingTaskProcess = bool;
    },
  },
});
