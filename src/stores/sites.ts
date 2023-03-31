import type { Site } from "@/types/site";
import { defineStore } from "pinia";

interface State {
	sites: Site[];
}

export const useSitesStore = defineStore({
	id: "sites",
	state: (): State => ({
		sites: [],
	}),
	getters: {
		getList: (state) => state.sites,
	},
	actions: {
		setSites(payload: Site[]): void {
			this.sites = payload;
		}
	},
});