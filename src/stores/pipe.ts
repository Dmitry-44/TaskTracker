import { defineStore } from "pinia";
import type { Pipe } from "@/types/pipe";

type State = {
	pipes: Pipe[];
	singlePipe: Pipe | null;
};

export const usePipeStore = defineStore({
	id: "pipe",
	state: (): State => ({
		pipes: [],
		singlePipe: null,
	}),
	getters: {
		getPipes: (state) => state.pipes,
		getSinglePipe: (state) => state.singlePipe,
	},
	actions: {
		setPipes(payload: Pipe[]) {
			this.pipes = payload;
		},
		setSinglePipe(payload: Pipe | null) {
			this.singlePipe = payload;
		},
	},
});