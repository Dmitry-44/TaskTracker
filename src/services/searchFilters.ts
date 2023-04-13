import type { IUserStore } from '@/adapters';
import type { FilterPayload } from '@/api';


export default class SearchFiltersService {

	userStore;
	
	constructor(userStore: IUserStore){
		this.userStore = userStore
	}

	LOCAL_STORAGE_PRE_KEY='tasks_filter_settings'
	FILTER_VERSION = '1.0'

	filtersBase: FilterPayload =
		{
		  filter: {
			// pipe_id: null,
			priority: [],
			dts: null,
			dtf: null,
			// smi_direction: [],
			// site_ids: [],
			search1: '',
			search2: '',
		  },
		  options: {
			onlyLimit: true,
			itemsPerPage: 1000,
		  },
		  select: [],
		};

	date = 
		[
			new Date(new Date().getTime() - 86400 * 1000).toLocaleDateString("en-CA"),
			new Date().toISOString().substr(0, 10),
		]

	getLocalStorageKey(){
		const user = this.userStore.getUser()
		if (!user) {
			console.log('user is not found')
			return ''
		}
		return `${this.LOCAL_STORAGE_PRE_KEY}_${this.FILTER_VERSION}_${user.id}`
	}

	setPersonalFilters(filters: FilterPayload): void {
		try {
			if(this.getLocalStorageKey().length===0){
				return
			}
			const data = JSON.parse(JSON.stringify(filters));
			delete data!.filter!["search1"];
			delete data!.filter!["search2"];
			delete data!.filter!["dts"];
			delete data!.filter!["dtf"];
			localStorage.setItem(
				this.getLocalStorageKey(),
				JSON.stringify(data)
			);
		} catch (err) {
			console.log(err);
		}
	}

	getPersonalFilters() {
		try {
			const filtersString = localStorage.getItem(this.getLocalStorageKey())
			if(!filtersString){
				this.setPersonalFilters(this.filtersBase)
				return this.filtersBase
			} else {
				const filter = JSON.parse(filtersString) as FilterPayload
				return filter
			}
		} catch (err) {
			console.log(err)
			return this.filtersBase
		}
	}

	resetFilters(filters: FilterPayload) {
		filters.filter['search1'] = null;
		filters.filter['search2'] = null;
		filters.filter['priority'] = [];
		// filters.filter['smi_direction'] = [];
		// filters.filter['site_ids'] = [];
	}

	applyFilters(filters: FilterPayload) {
		if(typeof filters.filter['search1'] === 'string'){
			if (filters.filter['search1'] === '') {
				filters.filter['search1'] = null;
			} else {
				filters.filter['search1'].trim()
			}
		}
		if(typeof filters.filter['search2'] === 'string'){
			if (filters.filter['search2'] === '') {
				filters.filter['search2'] = null;
			} else {
				filters.filter['search2'].trim()
			}
		}
		
		this.setPersonalFilters(filters);
	}
}