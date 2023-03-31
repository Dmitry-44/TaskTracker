import type { Operation } from '@/types/operation';
import { useOperationStore } from '@/stores/operation';
import type { IOperationStore } from './types';


export default class PiniaOperationAdapter implements IOperationStore {

	operationStore; 

	constructor(){
		this.operationStore = useOperationStore();
	}

	setOperations(payload: Operation[]){
		return this.operationStore.setOperations(payload);
	}
	setSingleOperation(payload: Operation | null): void {
		return this.operationStore.setSingleOperation(payload);
	}

}