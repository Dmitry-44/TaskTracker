import { defineStore } from "pinia";

type State = {
	detailWindowIsOpen: boolean;
	filtersIsOpen: boolean,
	isCreatingTaskProcess: boolean;
	globalLoading: boolean;
	showFinishTaskModal: boolean;
	showTakeTaskModal: boolean;
};

export const useCommonStore = defineStore({
	id: "common",
	state: (): State => ({
		detailWindowIsOpen: false,
		filtersIsOpen: false,
		isCreatingTaskProcess: false,
		globalLoading: false,
		showFinishTaskModal: false,
		showTakeTaskModal: false
	}),
	getters: {
		getIsCreatingTaskProcess: (state) => state.isCreatingTaskProcess,
		getDetailWindowIsOpen: (state) => state.detailWindowIsOpen,
		getGlobalLoading: (state) => state.globalLoading,
		getShowFinishTaskModal: (state) => state.showFinishTaskModal,
		getShowTakeTaskModal: (state) => state.showTakeTaskModal,
		getFiltersIsOpen: (state) => state.filtersIsOpen
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
		},
		openTakeTaskModal(): void {
			this.showTakeTaskModal = true
		},
		hideTakeTaskModal(): void {
			this.showTakeTaskModal = false
		},
		openFilters():void {
			this.filtersIsOpen=true
		},
		hideFilters():void {
			this.filtersIsOpen=false
		}
	},
});