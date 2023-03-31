import { useInterfaceStore } from './../stores/interface';
import type { IInterfaceStore } from './types';


export default class PiniaInterfaceAdapter implements IInterfaceStore {

	interfaceStore; 

	constructor(){
		this.interfaceStore = useInterfaceStore();
	}

	getIsCreatingTaskProcess(){
		return this.interfaceStore.getIsCreatingTaskProcess;
	}
    getDetailWindowIsOpen() {
        return this.interfaceStore.getDetailWindowIsOpen;
    }
	toggleDetailsWindow(bool: boolean){
        return this.interfaceStore.toggleDetailsWindow(bool);
    }
	toggleCreatingTaskProcess(bool: boolean){
        return this.interfaceStore.toggleCreatingTaskProcess(bool);
    }
}