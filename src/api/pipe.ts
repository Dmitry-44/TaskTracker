import { envConfig } from "@/plugins/envConfig";
import type { FilterPayload } from "@/types/api";
import type { ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";
import { axiosClient } from "../plugins/axios";

export default class PipeRepo implements IPipeRepo {
	
	GetPipes(payload?: FilterPayload): Promise<ApiResponse<Pipe>> {
		return axiosClient
				.post(`${envConfig.API_URL}tasktracker/pipe`, payload)
				.then(res => res.data)
	}

	SendPipe(payload: Partial<Pipe>): Promise<ApiResponse<Pipe>> {
		const api = payload?.id
			? `${envConfig.API_URL}tasktracker/pipe/${payload?.id}`
			: `${envConfig.API_URL}tasktracker/pipe`;
		return axiosClient
				.put(api, payload)
				.then(res => res.data);
	}
}
