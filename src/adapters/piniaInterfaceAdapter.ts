import { useInterfaceStore } from './../stores/interface';
import type { IInterfaceStore } from './types';


export default class PiniaInterfaceAdapter implements IInterfaceStore {

	interfaceStore; 

	constructor(){
		this.interfaceStore = useInterfaceStore();
	}

	getGlobalLoading(): boolean {
		return this.interfaceStore.getGlobalLoading;
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
	showGlobalLoader(): void {
		return this.interfaceStore.toggleGlobalLoading(true);
	}
	hideGlobalLoader(): void {
		return this.interfaceStore.toggleGlobalLoading(false);
	}

}