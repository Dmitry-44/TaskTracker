import { isResultWithPagination } from "./../types/api";
import { errRequestHandler, errVueHandler } from "@/plugins/errorResponser";
import { usePipeStore } from "@/stores/pipe";
import type { FilterPayload } from "@/types";
import { isSuccessApiResponse, type ApiResponse } from "@/types/api";
import type { IPipeRepo, Pipe } from "@/types/pipe";


const pipeStore = usePipeStore();

export default class PipeService {
	pipeRepo;

	constructor(pipeRepo: IPipeRepo) {
		this.pipeRepo = pipeRepo;
	}

	fetchPipes = (payload?: FilterPayload) => {
		return this.pipeRepo.GetPipes(payload)
			.then(respdata => {
				if (isSuccessApiResponse(respdata)) {
					if (payload?.filter!["id"]) {
						if (isResultWithPagination(respdata.result)) {
							pipeStore.setSinglePipe(respdata.result.queryResult[0])
						} else {
							const payload =
								respdata.result.length > 0
									? respdata.result[0]
									: null;
							pipeStore.setSinglePipe(payload);
						}
					} else {
						if (isResultWithPagination(respdata.result)) {
							pipeStore.setPipes(respdata.result.queryResult);
						} else {
							pipeStore.setPipes(respdata.result);
						}
					}
					return true;
				} else {
					return respdata.message || -1;
				}
			})
			.catch(err => errRequestHandler(err))
	}

	sendPipe = (payload: Partial<Pipe> | Pipe) => {
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