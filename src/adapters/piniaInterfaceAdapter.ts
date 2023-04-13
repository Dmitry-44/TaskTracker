import { useInterfaceStore } from './../stores/interface';
import type { IInterfaceStore } from '.';


export default class PiniaInterfaceAdapter implements IInterfaceStore {

	interfaceStore; 

	constructor(){
		this.interfaceStore = useInterfaceStore();
	}

	getGlobalLoading(): boolean {
		return this.interfaceStore.getGlobalLoading;
	}
	getIsCreatingTaskProcess(): boolean{
		return this.interfaceStore.getIsCreatingTaskProcess;
	}
    getDetailWindowIsOpen(): boolean {
        return this.interfaceStore.getDetailWindowIsOpen;
    }
	toggleDetailsWindow(bool: boolean){
    	 this.interfaceStore.toggleDetailsWindow(bool);
    }
	toggleCreatingTaskProcess(bool: boolean){
        this.interfaceStore.toggleCreatingTaskProcess(bool);
    }
	showGlobalLoader(): void {
		this.interfaceStore.toggleGlobalLoading(true);
	}
	hideGlobalLoader(): void {
		this.interfaceStore.toggleGlobalLoading(false);
	}
	openFinishTaskModal(): void {
		this.interfaceStore.openFinishTaskModal()
	}

}