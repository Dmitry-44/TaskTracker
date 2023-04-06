import { defineStore } from "pinia";
import type { Operation } from "@/types/operation";


type OperationsById = {
	[key: string]: Operation;
};

type State = {
	operations: Operation[];
	singleOperation: Operation | null;
	directionOptions: Record<string, any>[]
};

export const useOperationStore = defineStore({
	id: "operation",
	state: (): State => ({
		operations: [],
		singleOperation: null,
		//TODO
		directionOptions: [{"id":0,"name":"Без направления","disabled":false},{"id":21,"name":"Политика","disabled":false},{"id":22,"name":"Общество","disabled":false},{"id":23,"name":"Проишествия","disabled":false},{"id":24,"name":"Экономика","disabled":false},{"id":25,"name":"Развлечения","disabled":false},{"id":26,"name":"Армия и ОПК","disabled":false},{"id":27,"name":"Ночь","disabled":false},{"id":28,"name":"Дзен","disabled":false}]
	}),
	getters: {
		getOperations: (state) => state.operations,
		getSingleOperation: (state) => state.singleOperation,
		getOperationsById: (state): OperationsById =>
			state.operations.reduce((acc, el) => {
				acc[el?.id!] = el;
				return acc;
			}, {} as OperationsById),
		getDirectionOptions: (state) => state.directionOptions
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