import type { ISiteRepo, Site } from '@/types/site';
import { envConfig } from "@/plugins/envConfig";
import { axiosClient } from "../plugins/axios";
import type { ApiResponse } from '@/types/api';

export default class SiteRepo implements ISiteRepo {
	GetAll(): Promise<ApiResponse<Site>> {
		return axiosClient
			.get(`${envConfig.API_URL}api/sites/list`)
			.then(res => res.data)
	}
}