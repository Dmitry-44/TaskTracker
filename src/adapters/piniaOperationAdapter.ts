import type { Operation } from '@/entities/operation';
import { useOperationStore } from '@/stores/operation';
import type { IOperationStore } from '.';


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