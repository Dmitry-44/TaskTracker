import { useSitesStore } from '@/stores/sites';
import type { Site } from '@/entities/site';
import type { ISiteStore } from './types';


export default class PiniaSiteAdapter implements ISiteStore {

	siteStore; 

	constructor(){
		this.siteStore = useSitesStore();
	}

	getList(){
		return this.siteStore.getList;
	}
	setSites(payload: Site[]): void {
		return this.siteStore.setSites(payload);
	}

}