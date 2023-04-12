import type { IPipeStore } from './types';
import { usePipeStore } from '@/stores/pipe';
import type { Pipe } from '@/entities/pipe';


export default class PiniaPipeAdapter implements IPipeStore {

	pipeStore; 

	constructor(){
		this.pipeStore = usePipeStore();
	}

	setPipes(payload: Pipe[]){
		return this.pipeStore.setPipes(payload);
	}
	setSinglePipe(payload: Pipe | null): void {
		return this.pipeStore.setSinglePipe(payload);
	}

}