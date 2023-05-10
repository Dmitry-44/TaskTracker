import { useCommonStore } from '../stores/common';
import type { ICommonStore } from '.';


export default class piniaCommonAdapter implements ICommonStore {

	commonStore; 

	constructor(){
		this.commonStore = useCommonStore();
	}

	getGlobalLoading(): boolean {
		return this.commonStore.getGlobalLoading;
	}
	getIsCreatingTaskProcess(): boolean{
		return this.commonStore.getIsCreatingTaskProcess;
	}
    getDetailWindowIsOpen(): boolean {
        return this.commonStore.getDetailWindowIsOpen;
    }
	toggleDetailsWindow(bool: boolean){
    	 this.commonStore.toggleDetailsWindow(bool);
    }
	toggleCreatingTaskProcess(bool: boolean){
        this.commonStore.toggleCreatingTaskProcess(bool);
    }
	showGlobalLoader(): void {
		this.commonStore.toggleGlobalLoading(true);
	}
	hideGlobalLoader(): void {
		this.commonStore.toggleGlobalLoading(false);
	}
	openFinishTaskModal(): void {
		this.commonStore.openFinishTaskModal()
	}
	openFilters(): void {
		this.commonStore.openFilters()
	}
	closeFilters(): void {
		this.commonStore.hideFilters()
	}

}