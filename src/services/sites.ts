import { isResultWithPagination } from './../types/api';
import { errRequestHandler } from '@/plugins/errorResponser';
import { isSuccessApiResponse } from '@/types/api';
import type { ISiteRepo } from '@/types/site';
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
                        this.siteStore.setSites(respdata.result.queryResult);
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