import type { ISiteRepo, Site } from '@/entities/site';
import { envConfig } from "@/plugins/envConfig";
import { axiosClient } from "../plugins/axios";
import type { ApiResponse } from '@/api';
import { errRequestHandler } from '@/plugins/errorResponser';

export default class SiteRepo implements ISiteRepo {
	GetAll(): Promise<ApiResponse<Site>> {
		return axiosClient
			.get(`${envConfig.API_URL}api/sites/list`)
			.then(res => res.data)
			.catch(err=> {
				return { message: errRequestHandler(err)}
			})
	}
}