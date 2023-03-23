import { isResultWithPagination } from './../types/api';
import { errRequestHandler } from '@/plugins/errorResponser';
import { useSitesStore } from '@/stores/sites';
import { isSuccessApiResponse } from '@/types/api';
import type { ISiteRepo } from '@/types/site';


const siteStore = useSitesStore()

export default class SiteService {
	siteRepo;

	constructor(siteRepo: ISiteRepo) {
		this.siteRepo = siteRepo;
	}

	fetchSites = () => {
		return this.siteRepo
            .GetAll()
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
                    if (isResultWithPagination(respdata.result)) {
                        siteStore.setSites(respdata.result.queryResult);
                    } else {
                        siteStore.setSites(respdata.result);
                    }
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	}
}