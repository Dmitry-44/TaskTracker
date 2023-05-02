import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { FilterPayload, ApiResponse } from "@/api";
import { Api } from "@/api/api";
import type { IPipeRepo, Pipe } from "@/entities/pipe";
import { axiosClient } from "../plugins/axios";

export default class PipeRepo extends Api implements IPipeRepo {
	
	//@ts-ignore
	select=[]
	//@ts-ignore
	filter={}
	//@ts-ignore
	options={}

	GetPipes(payload?: FilterPayload): Promise<ApiResponse<Pipe>> {
		const data = this.mergeFilters(payload)
		return axiosClient
				.post(`${envConfig.API_URL}tasktracker/pipe`, data)
				.then(res => res.data)
				.catch(err=> {
					return { message: errRequestHandler(err)}
				})
	}

	SendPipe(payload: Partial<Pipe>): Promise<ApiResponse<Pipe>> {
		const api = payload?.id
			? `${envConfig.API_URL}tasktracker/pipe/${payload?.id}`
			: `${envConfig.API_URL}tasktracker/pipe`;
		return axiosClient
				.put(api, payload)
				.then(res => res.data)
				.catch(err=> {
					return { message: errRequestHandler(err)}
				})
	}
}
