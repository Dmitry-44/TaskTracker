import { isSuccessApiResponse } from '@/api';
import { errRequestHandler, errVueHandler } from '@/plugins/errorResponser';
import type { ISiteRepo } from '@/entities/site';
import type { ISiteStore } from '@/adapters';



export default class SiteService {
	siteRepo;
	siteStore;

	constructor(siteRepo: ISiteRepo, siteStore: ISiteStore) {
		this.siteRepo = siteRepo;
		this.siteStore = siteStore
	}

	async fetchSites(): Promise<boolean> {
		return this.siteRepo
            .GetAll()
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
                        this.siteStore.setSites(respdata.result);
					return true;
				} else {
					return errVueHandler(respdata.message || -1)
				}
			})
			.catch(err => errRequestHandler(err));
	}
}