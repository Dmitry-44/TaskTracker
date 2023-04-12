import { envConfig } from "@/plugins/envConfig";
import { errRequestHandler } from "@/plugins/errorResponser";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "@/types/api";
import type { IOperationRepo, Operation } from "@/types/operation";
import { axiosClient } from "../plugins/axios";


export default class OperationRepo implements IOperationRepo {
	
	GetOperations(payload?: FilterPayload): Promise<ApiResponse<Operation>> {
		return axiosClient
      		.post(`${envConfig.API_URL}tasktracker/operations`,payload)
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