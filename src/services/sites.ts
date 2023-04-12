import { isResultWithPagination, isSuccessApiResponse } from '@/api';
import { errRequestHandler } from '@/plugins/errorResponser';
import type { ISiteRepo } from '@/entities/site';
import type PiniaSiteAdapter from '@/adapters/piniaSiteAdapter';



export default class SiteService {
	siteRepo;
	siteStore;

	constructor(siteRepo: ISiteRepo, siteStore: PiniaSiteAdapter) {
		this.siteRepo = siteRepo;
		this.siteStore = siteStore
	}

	fetchSites = () => {
		return this.siteRepo
            .GetAll()
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
                    if (isResultWithPagination(respdata.result)) {
                        this.siteStore.setSites(respdata.result.data);
                    } else {
                        this.siteStore.setSites(respdata.result);
                    }
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}
}