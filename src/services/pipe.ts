import { isResultWithPagination } from "./../types/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/types/api";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";
import type PiniaPipeAdapter from "@/adapters/piniaPipeAdapter";



export default class PipeService {
	pipeRepo;
	pipeStore;

	constructor(pipeRepo: IPipeRepo, pipeStore: PiniaPipeAdapter) {
		this.pipeRepo = pipeRepo;
		this.pipeStore = pipeStore;
	}

	fetchPipes = (payload?: FilterPayload) => {
		return this.pipeRepo.GetPipes(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							this.pipeStore.setSinglePipe(respdata.result.queryResult[0])
						} else {
							const payload =
								respdata.result.length > 0
									? respdata.result[0]
									: null;
							this.pipeStore.setSinglePipe(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							this.pipeStore.setPipes(respdata.result.queryResult);
						} else {
							this.pipeStore.setPipes(respdata.result);
						}
					}
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	sendPipe = (payload: Partial<Pipe>) => {
		return this.pipeRepo
			.SendPipe(payload)
			.then((respdata) => {
				if (isSuccessApiResponse(respdata)) {
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err));
	};
}