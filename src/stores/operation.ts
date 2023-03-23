import { defineStore } from "pinia";
import type { Operation } from "@/types/operation";


type OperationsById = {
	[key: string]: Operation;
};

type State = {
	operations: Operation[];
	singleOperation: Operation | null;
};

export const useOperationStore = defineStore({
	id: "operation",
	state: (): State => ({
		operations: [],
		singleOperation: null,
	}),
	getters: {
		getOperations: (state) => state.operations,
		getSingleOperation: (state) => state.singleOperation,
		getOperationsById: (state): OperationsById =>
			state.operations.reduce((acc, el) => {
				acc[el?.id!] = el;
				return acc;
			}, {} as OperationsById),
	},
	actions: {
		setOperations(payload: Operation[]) {
			this.operations = payload;
		},
		setSingleOperation(payload: Operation | null) {
			this.singleOperation = payload;
		},
	},
});