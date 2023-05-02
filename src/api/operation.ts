import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { FilterPayload } from "@/api";
import { Api } from "@/api/api";
import type { ApiResponse } from "@/api";
import type { IOperationRepo, Operation } from "@/entities/operation";
import { axiosClient } from "../plugins/axios";


export default class OperationRepo extends Api implements IOperationRepo {

	//@ts-ignore
	select=[]
	//@ts-ignore
	filter={}
	//@ts-ignore
	options={}

	GetOperations(payload?: FilterPayload): Promise<ApiResponse<Operation>> {
		const data = this.mergeFilters(payload)
		return axiosClient
      		.post(`${envConfig.API_URL}tasktracker/operations`, data)
			.then(res => res.data)
			.catch(err=> {
				return { message: errRequestHandler(err)}
			})
	}

	SendOperation(payload: Partial<Operation>): Promise<ApiResponse<Operation>> {
		const api = payload?.id
			? `${envConfig.API_URL}tasktracker/operation/${payload?.id}`
			: `${envConfig.API_URL}tasktracker/operation`;
		return axiosClient
			.put(api, payload)
			.then(res => res.data)
			.catch(err=> {
				return { message: errRequestHandler(err)}
			})
	}
}