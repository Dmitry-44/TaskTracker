import { defineStore } from "pinia";

type State = {
	detailWindowIsOpen: boolean;
	isCreatingTaskProcess: boolean;
	globalLoading: boolean;
	showFinishTaskModal: boolean;
};

export const useCommonStore = defineStore({
	id: "common",
	state: (): State => ({
		detailWindowIsOpen: false,
		isCreatingTaskProcess: false,
		globalLoading: false,
		showFinishTaskModal: false,
	}),
	getters: {
		getIsCreatingTaskProcess: (state) => state.isCreatingTaskProcess,
		getDetailWindowIsOpen: (state) => state.detailWindowIsOpen,
		getGlobalLoading: (state) => state.globalLoading,
		getShowFinishTaskModal: (state) => state.showFinishTaskModal
	},
	actions: {
		toggleDetailsWindow(bool: boolean): void {
			this.detailWindowIsOpen = bool;
		},
		toggleCreatingTaskProcess(bool: boolean): void {
			this.isCreatingTaskProcess = bool;
		},
		toggleGlobalLoading(bool: boolean): void {
			this.globalLoading = bool
		},
		openFinishTaskModal(): void {
			this.showFinishTaskModal = true
		},
		hideFinishTaskModal(): void {
			this.showFinishTaskModal = false
		}
	},
});